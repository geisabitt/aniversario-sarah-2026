import { NextResponse } from 'next/server';
const API=process.env.GOOGLE_SCRIPT_URL;
export const dynamic='force-dynamic';
export async function GET(){
 if(!API)return NextResponse.json({erro:'Configure GOOGLE_SCRIPT_URL no .env.local'},{status:503});
 try{const r=await fetch(API,{cache:'no-store',signal:AbortSignal.timeout(12000)});if(!r.ok)throw Error('Planilha indisponível');const data=await r.json();if(!Array.isArray(data))throw Error('Resposta inválida');return NextResponse.json(data,{headers:{'Cache-Control':'no-store'}})}catch{return NextResponse.json({erro:'Não foi possível carregar os itens'},{status:502})}
}
export async function POST(req:Request){
 if(!API)return NextResponse.json({erro:'Configure GOOGLE_SCRIPT_URL'},{status:503});
 try{const body=await req.json();const id=Number(body.id);const nome=String(body.nome||'').trim();if(!Number.isSafeInteger(id)||id<1||nome.length<2||nome.length>100)return NextResponse.json({erro:'Informe um nome válido'},{status:400});const r=await fetch(API,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({id,nome}),redirect:'follow',cache:'no-store',signal:AbortSignal.timeout(15000)});if(!r.ok)throw Error('Falha na planilha');const data=await r.json();return NextResponse.json(data,{status:data.success?200:409})}catch{return NextResponse.json({erro:'Não foi possível confirmar a escolha'},{status:502})}
}
