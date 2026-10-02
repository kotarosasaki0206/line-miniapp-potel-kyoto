'use client';

import { useState } from 'react';
import {
  BookOpen, Coffee, MapPin, MessageSquare, ChevronLeft, Check,
  QrCode, ExternalLink, ArrowRight, BedDouble, Waves, Building2,
} from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { content, demoCode, hotelName, lookup, reception } from './content';
import QrScanner from './qr-scanner';

const menus = [
  { Icon: Building2, label: '館内情報', en: 'FACILITIES' },
  { Icon: Waves, label: 'ぽて湯', en: 'SENTO' },
  { Icon: Coffee, label: 'レストラン', en: 'DINING' },
  { Icon: BedDouble, label: '客室', en: 'ROOMS' },
  { Icon: MapPin, label: 'アクセス', en: 'ACCESS' },
  { Icon: BookOpen, label: 'あわいの間', en: 'AWAI NO MA' },
];

const questions = [
  '今回のご滞在に、どのくらい満足されましたか？',
  'お部屋の快適さはいかがでしたか？',
  'スタッフの対応はいかがでしたか？',
  'レストランやぽて湯などの館内施設はいかがでしたか？',
  'また当ホテルに宿泊したいと思いますか？',
];

const emptyGuest = { name: '', kana: '', phone: '', address: '' };

export default function Home() {
  const [page, setPage] = useState('home');
  const [step, setStep] = useState(0);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [guest, setGuest] = useState(emptyGuest);
  const [consent, setConsent] = useState(false);
  const [ticket, setTicket] = useState('');
  const [answers, setAnswers] = useState<string[]>(['', '', '', '', '']);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [scanning, setScanning] = useState(false);

  const go = (target: string) => {
    setPage(target);
    setError('');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const find = () => {
    if (lookup(code) < 0) {
      setError('予約が見つかりません。デモ用予約番号（例：' + demoCode + '）をご入力ください。');
      return;
    }
    setCode(demoCode);
    setError('');
    setStep(1);
  };

  const finish = () => {
    if (!consent) {
      setError('内容をご確認のうえ、同意にチェックを入れてください。');
      return;
    }
    setTicket(demoCode);
    setStep(3);
    setError('');
  };

  return (
    <main className="phone">
      <header className="appbar">
        {page === 'home'
          ? <span className="line">P</span>
          : <button className="back" onClick={() => go('home')} aria-label="トップへ戻る"><ChevronLeft size={20} /></button>}
        <strong>ご滞在ガイド</strong>
        <span className="demo">DEMO</span>
      </header>

      {page === 'home' ? (
        <>
          <div className="brand">POTEL<small>UMEKOJI KYOTO</small></div>
          <div className="hero">
            <img src="/kyoto-concept.png" alt="京都のホテルラウンジをイメージした生成画像" />
            <div><span>KYOTO · UMEKOJI</span><h1>ぽーっと、京都を楽しむ。</h1></div>
          </div>
          <section className="body">
            <div className="stay">
              <span className="eyebrow">ご宿泊のホテル</span>
              <strong className="hotel-name">{hotelName}</strong>
              <p><MapPin size={14} /> 京都府京都市下京区観喜寺町15</p>
            </div>
            <p className="concept-note">※ヒーロー画像は施設の実写真ではないコンセプト画像です。</p>
            <div className="section-label"><h2>ご滞在をもっと快適に</h2><span>GUEST GUIDE</span></div>
            <div className="tiles">
              <a className="tile" href="/booking/"><MessageSquare size={30} strokeWidth={1.4} /><b>チャット予約</b><small>BOOKING DEMO</small><ArrowRight className="tile-arrow" size={15} /></a>
              {menus.map(({ Icon, label, en }) => (
                <button className="tile" key={label} onClick={() => go(label)}>
                  <Icon size={30} strokeWidth={1.4} /><b>{label}</b><small>{en}</small><ArrowRight className="tile-arrow" size={15} />
                </button>
              ))}
            </div>
            <button className="primary checkin" onClick={() => go('checkin')}>
              <QrCode /><span><b>{ticket ? 'チェックインQRを確認' : 'モバイルチェックイン'}</b><small>架空の予約番号で手続きを体験</small></span><ArrowRight />
            </button>
            <button className="survey-link" onClick={() => go('survey')}>
              <MessageSquare /><span><b>{submitted ? 'アンケート回答済み' : 'ご滞在の感想をお聞かせください'}</b><small>アンケート・全5問</small></span><ArrowRight size={18} />
            </button>
            <p className="demo-note">非公式の提案用デモ · 実際の予約・決済・手続きは行われません</p>
          </section>
        </>
      ) : (
        <section className="body">
          <button className="back" onClick={() => go('home')}><ChevronLeft size={17} />トップへ</button>
          {menus.some(menu => menu.label === page) ? (
            <>
              <h1 className="page-title">{page}</h1>
              <p className="intro">{hotelName}にご宿泊のお客様へ</p>
              {(page === 'あわいの間' ? content('館内情報').filter(item => item.title === 'あわいの間') : content(page)).map(item => (
                <article className="card" key={item.title}>
                  <span className="tag">{item.tag}</span>
                  <h2>{item.title}</h2>
                  <p>{item.body}</p>
                  {item.detail && <p>{item.detail}</p>}
                  <a className="source" href={item.url} target="_blank" rel="noreferrer">公式情報を見る<ExternalLink size={13} /></a>
                </article>
              ))}
              <p className="demo-note">公式サイト公開情報をもとに作成（2026年10月2日確認）。営業・料金・利用条件は変更される場合があります。</p>
            </>
          ) : page === 'checkin' ? (
            <>
              <h1 className="page-title">モバイルチェックイン</h1>
              <p className="intro">架空の予約を使った事前登録の体験です。</p>
              <div className="steps" aria-label={'ステップ' + (step + 1) + '/4'}>
                {['予約番号検索', '宿泊者情報', '確認', '完了QR'].map((label, index) => (
                  <div key={label} className={'step ' + (index <= step ? 'active' : '')} aria-current={index === step ? 'step' : undefined}>
                    <i>{index < step ? <Check size={15} /> : index + 1}</i>{label}
                  </div>
                ))}
              </div>
              {step === 0 ? (
                <div className="card">
                  <h2>デモ予約を検索</h2>
                  <p>サンプル予約番号：<b>{demoCode}</b></p>
                  <form onSubmit={event => { event.preventDefault(); find(); }}>
                    <label className="field">予約番号
                      <input value={code} onChange={event => setCode(event.target.value)} placeholder={demoCode} autoCapitalize="characters" required />
                    </label>
                    {error && <p className="error" role="alert">{error}</p>}
                    <button className="primary" type="submit">予約を検索<ArrowRight size={18} /></button>
                    <button className="primary qr-read-button" type="button" onClick={() => setScanning(true)}><QrCode size={18} />QRコードを読み取る</button>
                  </form>
                </div>
              ) : step === 1 ? (
                <form onSubmit={event => {
                  event.preventDefault();
                  if (Object.values(guest).some(value => !value.trim())) { setError('すべての項目を入力してください。'); return; }
                  setError(''); setStep(2); window.scrollTo(0, 0);
                }}>
                  <div className="notice">デモ予約が見つかりました：{hotelName}<br />実際の予約情報とは連携していません。</div>
                  <p className="intro">架空の情報でお試しください。入力内容は送信・保存されません。</p>
                  <button className="secondary" type="button" style={{ marginBottom: 18 }} onClick={() => setGuest({ name: '山田 太郎', kana: 'ヤマダ タロウ', phone: '09000000000', address: '京都市内（デモ用住所）' })}>サンプル情報を入力</button>
                  {(['name', 'kana', 'phone', 'address'] as const).map((key, index) => (
                    <label className="field" key={key}>{['氏名', 'フリガナ', '電話番号', '住所'][index]}
                      <input required value={guest[key]} onChange={event => setGuest({ ...guest, [key]: event.target.value })}
                        type={key === 'phone' ? 'tel' : 'text'} pattern={key === 'phone' ? '[0-9+() -]{10,20}' : undefined} maxLength={key === 'address' ? 200 : 80} />
                    </label>
                  ))}
                  {error && <p className="error" role="alert">{error}</p>}
                  <button className="primary" type="submit">入力内容を確認<ArrowRight size={18} /></button>
                  <button className="secondary" type="button" onClick={() => { setStep(0); setConsent(false); }}>予約検索に戻る</button>
                </form>
              ) : step === 2 ? (
                <>
                  <div className="card"><h2>登録内容をご確認ください</h2>
                    <dl className="summary">
                      {[
                        ['予約番号', code], ['ご宿泊館', hotelName], ['氏名', guest.name],
                        ['フリガナ', guest.kana], ['電話番号', guest.phone], ['住所', guest.address], ['ご到着時の受付', reception],
                      ].map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}
                    </dl>
                  </div>
                  <label className="consent"><Checkbox checked={consent} onCheckedChange={value => setConsent(!!value)} /><span>入力内容を確認しました。これはデモで、実際のチェックインには使えません。</span></label>
                  {error && <p className="error" role="alert">{error}</p>}
                  <button className="primary" onClick={finish}>デモの事前登録を完了する</button>
                  <button className="secondary" onClick={() => { setStep(1); setError(''); }}>入力内容を修正</button>
                </>
              ) : (
                <div className="success">
                  <div className="success-icon"><Check size={29} /></div><h2>デモ登録が完了しました</h2>
                  <p className="intro">実際のチェックインには利用できません。</p>
                  <div className="card"><span className="tag">デモ専用・実際の受付には使えません</span><img className="qr" src="/qr-0.svg" alt={'デモ受付番号 ' + ticket + ' のQRコード'} /><b>{ticket}</b><p>{hotelName}</p></div>
                  <div className="notice" style={{ textAlign: 'left' }}>実際のご到着時はホテルのフロントでお手続きください。</div>
                  <button className="primary" onClick={() => go('home')}>トップへ戻る</button>
                  <button className="secondary" onClick={() => { setStep(0); setTicket(''); setCode(''); setGuest(emptyGuest); setConsent(false); }}>もう一度試す</button>
                </div>
              )}
            </>
          ) : (
            <>
              <h1 className="page-title">ご滞在アンケート</h1>
              <p className="intro">{hotelName}<br />全5問 · 目安1分</p>
              {submitted ? (
                <div className="success"><div className="success-icon"><Check size={29} /></div><h2>ご回答ありがとうございました</h2><p className="intro">デモの回答受付が完了しました。<br />回答は送信・保存されていません。</p>
                  <button className="primary" onClick={() => go('home')}>トップへ戻る</button>
                  <button className="secondary" onClick={() => { setSubmitted(false); setAnswers(['', '', '', '', '']); setComment(''); }}>もう一度試す</button>
                </div>
              ) : (
                <form onSubmit={event => {
                  event.preventDefault();
                  if (answers.some(answer => !answer)) { setError('5問すべてにご回答ください。'); return; }
                  setError(''); setSubmitted(true); window.scrollTo(0, 0);
                }}>
                  {questions.map((question, index) => (
                    <fieldset className="question card" key={question}><legend>{index + 1}. {question}</legend>
                      <RadioGroup className="rating" value={answers[index]} onValueChange={value => setAnswers(answers.map((answer, item) => item === index ? String(value) : answer))} aria-label={question}>
                        {['1', '2', '3', '4', '5'].map(value => <label key={value}><RadioGroupItem value={value} />{value}</label>)}
                      </RadioGroup>
                      <div className="scale"><span>{index === 4 ? '思わない' : '不満'}</span><span>{index === 4 ? 'とても思う' : 'とても満足'}</span></div>
                      {index === 3 && <label style={{ display: 'flex', gap: 10, fontSize: 13, marginTop: 12 }}><Checkbox checked={answers[index] === '未利用'} onCheckedChange={value => setAnswers(answers.map((answer, item) => item === index ? (value ? '未利用' : '') : answer))} />利用していない</label>}
                    </fieldset>
                  ))}
                  <label className="field">ご意見・ご感想（任意）<textarea rows={3} maxLength={1000} value={comment} onChange={event => setComment(event.target.value)} placeholder="お気づきの点をお聞かせください" /></label>
                  {error && <p className="error" role="alert">{error}</p>}
                  <button className="primary" type="submit">回答を完了する<ArrowRight size={18} /></button>
                  <p className="demo-note">デモのため回答は送信・保存されません。</p>
                </form>
              )}
            </>
          )}
        </section>
      )}
      <QrScanner open={scanning} onClose={() => setScanning(false)} onRead={value => { setCode(value); setError(''); setScanning(false); }} />
    </main>
  );
}
