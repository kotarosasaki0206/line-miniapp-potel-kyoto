'use client';
import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { reservationFromQr } from './content';

function CameraView({onRead,onClose}:{onRead:(value:string)=>void;onClose:()=>void}){
 const video=useRef<HTMLVideoElement>(null);
 const readRef=useRef(onRead),closeRef=useRef(onClose);readRef.current=onRead;closeRef.current=onClose;
 const [message,setMessage]=useState('カメラへのアクセスを許可してください。');
 const [failed,setFailed]=useState(false);
 useEffect(()=>{
  let disposed=false,stream:MediaStream|null=null,timer:ReturnType<typeof setTimeout>|undefined;
  const stop=()=>{stream?.getTracks().forEach(track=>track.stop());if(timer)clearTimeout(timer)};
  const hidden=()=>{if(document.hidden)closeRef.current()};document.addEventListener('visibilitychange',hidden);
  async function start(){
   try{
    if(!navigator.mediaDevices?.getUserMedia)throw new Error('UNSUPPORTED');
    stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});
    if(disposed){stop();return;}
    if(!video.current){stop();return;}
    video.current.srcObject=stream;await video.current.play();if(disposed){stop();return;}
    setMessage('予約用QRコードを枠内にかざしてください。');
    const canvas=document.createElement('canvas');const ctx=canvas.getContext('2d',{willReadFrequently:true});
    if(!ctx)throw new Error('CANVAS');
    const scan=()=>{
     if(disposed)return;
     const v=video.current;
     if(v&&v.readyState>=2&&v.videoWidth){
      canvas.width=Math.min(v.videoWidth,640);canvas.height=Math.round(v.videoHeight*canvas.width/v.videoWidth);
      ctx.drawImage(v,0,0,canvas.width,canvas.height);
      const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);
      const qr=jsQR(pixels.data,pixels.width,pixels.height);
      if(qr){const reservation=reservationFromQr(qr.data);if(reservation){stop();readRef.current(reservation);return;}setMessage('このQRコードはデモの予約用ではありません。別のコードをかざしてください。');}
     }
     timer=setTimeout(scan,220);
    };scan();
   }catch(e){stop();if(disposed)return;const name=e instanceof Error?e.name:'';setFailed(true);setMessage(name==='NotAllowedError'?'カメラが許可されていません。ブラウザのカメラ設定を確認するか、予約番号を入力してください。':name==='NotFoundError'?'カメラが見つかりません。予約番号を入力してください。':'カメラを起動できません。カメラ対応ブラウザで開くか、予約番号を入力してください。');}
  }
  void start();return ()=>{disposed=true;stop();document.removeEventListener('visibilitychange',hidden)};
 },[]);
 return <><div className="camera-frame"><video ref={video} muted autoPlay playsInline aria-label="QRコード読み取り用カメラ"/>{!failed&&<div className="camera-target" aria-hidden="true"/>}</div><p role="status" className={failed?'error':'intro'}>{message}</p><p className="demo-note">映像はこの端末内でのみ処理し、保存・送信しません。</p><button className="secondary" onClick={onClose}>閉じて予約番号を入力</button></>;
}
export default function QrScanner({open,onClose,onRead}:{open:boolean;onClose:()=>void;onRead:(value:string)=>void}){
 return <Dialog open={open} onOpenChange={v=>{if(!v)onClose()}}><DialogContent><DialogTitle>QRコードを読み取る</DialogTitle><DialogDescription>ご予約のQRコードをカメラにかざしてください。</DialogDescription>{open&&<CameraView onClose={onClose} onRead={onRead}/>}</DialogContent></Dialog>;
}
