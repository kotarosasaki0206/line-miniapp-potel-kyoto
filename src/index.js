const HOTEL = { id: 'potel', name: '梅小路ポテル京都', short: 'ポテル京都', address: '京都府京都市下京区観喜寺町15', note: '梅小路公園に隣接するホテル' };

const ROOMS = [
  { id: 'garden-twin', hotelId: 'potel', hotel: HOTEL.name, name: 'ガーデンツイン', size: '31.6㎡', capacity: 3, tag: 'パークビュー', demoPrice: 22000, desc: '公園とのつながりを感じるテラス付き客室。' },
  { id: 'wood-box', hotelId: 'potel', hotel: HOTEL.name, name: 'ウッドボックスツイン', size: '25㎡', capacity: 2, tag: '木の温もり', demoPrice: 18000, desc: '靴を脱いでくつろぐウッドタイプ。シャワーのみ。' },
  { id: 'potel-room', hotelId: 'potel', hotel: HOTEL.name, name: 'ポテルルーム', size: '18.3㎡', capacity: 2, tag: 'シンプル', demoPrice: 16000, desc: '梅小路横丁に近い客室。室内に入浴設備はありません。' },
];

const PLANS = [
  { id: 'breakfast', name: '朝食付きデモプラン', desc: 'レストランの朝食を想定した体験用プラン', add: 3000, tag: '朝食' },
  { id: 'room-only', name: '素泊まりデモプラン', desc: '客室のみを想定した体験用プラン', add: 0, tag: 'シンプル' },
];

const FAQ = [
  { keys: ['温泉', '大浴場', '風呂', 'ぽて湯', '銭湯'], answer: '1Fに「梅小路銭湯 ぽて湯」があります。温泉や一般的な大浴場ではありません。宿泊者向けの利用時間は公式案内をご確認ください。' },
  { keys: ['あわい', '本', 'ゲーム', '音楽'], answer: 'あわいの間にはBook、Game、Music、Mokuのテーマ別スペースがあります。' },
  { keys: ['アクセス', '住所', '場所', '駅', '駐車場'], answer: '京都市下京区観喜寺町15です。JR「梅小路京都西」駅から徒歩約5分。敷地内コインパーキングは台数に限りがあり、予約できません。' },
  { keys: ['レストラン', '朝食', '食事', 'カフェ'], answer: '1Fにレストラン、1〜2Fにカフェ ポラムがあります。営業時間とメニューは公式サイトでご確認ください。' },
  { keys: ['チェックイン', 'チェックアウト'], answer: '公式客室案内ではチェックイン15:00、チェックアウト11:00です。こちらの手続きは体験用デモで、実際のチェックインには使えません。' },
];

function json(data, init = {}) {
  return new Response(JSON.stringify(data), { ...init, headers: { 'content-type': 'application/json; charset=utf-8', ...(init.headers || {}) } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') return json({ ok: true, service: 'potel-kyoto-demo' });
    if (url.pathname === '/api/hotel') return json({ hotels: [HOTEL], rooms: ROOMS, plans: PLANS, demo: true });

    if (url.pathname === '/api/chat' && request.method === 'POST') {
      let body;
      try { body = await request.json(); } catch { return json({ error: 'invalid_json' }, { status: 400 }); }
      const action = body.action || 'message';
      const context = body.context || {};
      const message = String(body.message || '').trim();

      if (action === 'search_rooms') {
        const guests = Math.min(3, Math.max(1, Number(context.guests || 2)));
        const rooms = ROOMS.filter(room => room.capacity >= guests);
        return json({ reply: guests + '名様向けの客室をご案内します。料金・空室はデモ用のサンプルです。', rooms, plans: PLANS, demo: true });
      }

      if (action === 'complete_booking') {
        const id = 'DEMO-POTEL-' + new Date().toISOString().slice(0, 10).replaceAll('-', '') + '-' + Date.now().toString().slice(-4);
        return json({ reply: 'デモ予約が完了しました。実際の予約は発生していません。', bookingId: id, demo: true });
      }

      const lower = message.toLowerCase();
      const faq = FAQ.find(item => item.keys.some(key => lower.includes(key.toLowerCase())));
      if (faq) return json({ reply: faq.answer, intent: 'faq' });
      if (['予約', '泊まり', '宿泊', '空室', '部屋'].some(key => message.includes(key))) {
        return json({ reply: '梅小路ポテル京都の客室を、デモで一緒に探しましょう。', intent: 'booking' });
      }
      return json({ reply: '宿泊デモのほか、ぽて湯、あわいの間、レストラン、アクセスをご案内できます。日付と人数も入力してみてください。', intent: 'fallback' });
    }

    return env.ASSETS.fetch(request);
  },
};
