import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { supabaseUrl, supabaseKey, method, payloadParams, rawJsonBody } = body;

    // Validasi input dasar
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'URL dan Key wajib diisi.' 
      }, { status: 400 });
    }

    let finalUrl = supabaseUrl.trim();
    
    // Jika GET dan ada custom payload dari UI Builder, injeksi ke URL sebagai query params
    if (method === 'GET' && payloadParams && payloadParams.length > 0) {
      try {
        const urlObj = new URL(finalUrl);
        payloadParams.forEach((param: {key: string, value: string}) => {
          if (param.key && param.value) {
            urlObj.searchParams.append(param.key, param.value);
          }
        });
        finalUrl = urlObj.toString();
      } catch(e) { /* URL parsing gagal, biarkan fetch yang menangani error */ }
    }

    // Siapkan body request untuk non-GET
    let requestBody: string | undefined = undefined;
    const contentType = 'application/json';
    
    if (method !== 'GET') {
      // Prioritas 1: Raw JSON body langsung dari textarea
      if (rawJsonBody && rawJsonBody.trim()) {
        // Validasi bahwa raw JSON valid
        try {
          JSON.parse(rawJsonBody);
          requestBody = rawJsonBody.trim();
        } catch (e) {
          return NextResponse.json({
            status: 400,
            statusText: 'Invalid JSON',
            headers: '',
            data: { error: 'Raw JSON body yang dikirim tidak valid. Periksa sintaks JSON Anda (pastikan menggunakan petik ganda untuk key dan string).' },
            latencyMs: 0
          }, { status: 400 });
        }
      }
      // Prioritas 2: Key-Value params (fallback jika raw kosong)  
      else if (payloadParams && payloadParams.length > 0) {
        const bodyObj: Record<string, any> = {};
        let hasData = false;

        payloadParams.forEach((param: {key: string, value: string}) => {
          if (param.key && param.value) {
            let val: any = param.value;
            if (val === 'true') val = true;
            else if (val === 'false') val = false;
            else if (!isNaN(Number(val)) && typeof val === 'string' && val.trim() !== '') {
              val = Number(val);
            }
            bodyObj[param.key] = val;
            hasData = true;
          }
        });

        if (hasData) {
          requestBody = JSON.stringify(bodyObj);
        }
      }
    }

    // Susun Headers Supabase
    const headers: Record<string, string> = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': contentType,
    };
    
    // Khusus PATCH di PostgREST Supabase
    if (method === 'PATCH' && finalUrl.includes('/rest/v1/')) {
       headers['Prefer'] = 'return=representation';
    }
    // Khusus POST insert di PostgREST
    if (method === 'POST' && finalUrl.includes('/rest/v1/') && !finalUrl.includes('/rpc/')) {
       headers['Prefer'] = 'return=representation';
    }

    const startTime = Date.now();
    
    // Tembak request ke Supabase target
    const response = await fetch(finalUrl, {
      method: method,
      headers: headers,
      body: requestBody
    });

    const endTime = Date.now();
    const latency = endTime - startTime;

    // Format response header asli
    const responseHeadersText = Array.from(response.headers.entries())
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
      
    // Tangkap data asli
    let bodyData;
    const bodyText = await response.text();
    try {
      bodyData = JSON.parse(bodyText);
    } catch(e) {
      bodyData = bodyText; 
    }

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      latencyMs: latency,
      headers: responseHeadersText,
      data: bodyData,
      requestMade: {
        url: finalUrl,
        method: method,
        payload: requestBody
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      statusText: 'Proxy Request Failed',
      headers: 'X-Error: Target unreachable / Invalid URL format',
      data: { error: error.message },
      latencyMs: 0
    }, { status: 500 });
  }
}
