export const hotelName = '梅小路ポテル京都';
export const demoCode = 'DEMO-POTEL-1001';
export const reception = 'ホテルのフロント';

export function lookup(code: string) {
  return code.trim().toUpperCase() === demoCode ? 0 : -1;
}

export type Info = {
  title: string;
  tag: string;
  body: string;
  detail?: string;
  url: string;
};

const roomsUrl = 'https://www.potel.jp/kyoto/rooms/';
const stayUrl = 'https://www.potel.jp/kyoto/stay/';
const restaurantUrl = 'https://www.potel.jp/kyoto/restaurant/';
const accessUrl = 'https://www.potel.jp/kyoto/access/';

export function content(page: string): Info[] {
  if (page === '館内情報') return [
    { title: 'チェックイン・チェックアウト', tag: 'ご宿泊案内', body: 'チェックイン 15:00 ／ チェックアウト 11:00。', detail: '実際のお手続きはホテルのフロントでご確認ください。', url: roomsUrl },
    { title: 'あわいの間', tag: '2F〜5F', body: 'Book、Game、Music、Moku。テーマの異なる空間で思い思いの時間を。', detail: '宿泊者専用スペースです。利用条件は公式案内をご確認ください。', url: stayUrl },
    { title: '梅小路醗酵所', tag: '1F', body: '麹やお酒、醗酵食品に出会える場所。', detail: 'イベントや営業状況は公式案内をご確認ください。', url: stayUrl },
    { title: 'ルーフトップテラス', tag: 'RF', body: '京都タワーや東寺を望む、空の開けたテラス。', detail: '宿泊者の利用時間は15:00〜24:00、4:30〜11:00（2026年10月2日確認）。変更の可能性があります。', url: stayUrl },
  ];
  if (page === 'ぽて湯') return [
    { title: '梅小路銭湯 ぽて湯', tag: '1F・銭湯', body: '懐かしさを楽しむ街の銭湯。温泉や一般的な大浴場ではありません。', detail: '宿泊者は15:00〜24:00、6:00〜10:00。宿泊料金に利用が含まれます（2026年10月2日確認）。', url: stayUrl },
    { title: 'ご利用前に', tag: 'ご案内', body: 'タオルの備え付けはありません。館内案内とマナーをご確認ください。', detail: '設備や営業状況は変更される場合があります。', url: stayUrl },
  ];
  if (page === 'レストラン') return [
    { title: 'レストラン', tag: '1F', body: '朝食、ランチ、ディナーを楽しめるレストラン。', detail: '営業時間やメニューは公式案内でご確認ください。', url: restaurantUrl },
    { title: 'カフェ ポラム', tag: '1〜2F', body: '珈琲や紅茶、季節のタルトを楽しめるカフェ。テイクアウトにも対応しています。', detail: '営業時間は10:00〜18:00（2026年10月2日確認）。', url: restaurantUrl },
  ];
  if (page === '客室') return [
    { title: 'ガーデンツイン', tag: '31.6㎡・1〜3名', body: '梅小路公園とのつながりを感じられるテラス付きの客室。', url: roomsUrl },
    { title: 'ウッドボックスツイン', tag: '25㎡・1〜2名', body: '靴を脱いでくつろぐ、木の温もりを感じる客室。', detail: '客室はシャワーのみです。', url: roomsUrl },
    { title: 'ポテルルーム', tag: '18.3㎡・1〜2名', body: '梅小路横丁に近い、シンプルな洋スタイルの客室。', detail: '客室内に入浴設備はありません。', url: roomsUrl },
  ];
  return [
    { title: '所在地', tag: '京都・梅小路', body: '〒600-8835 京都府京都市下京区観喜寺町15', url: accessUrl },
    { title: '電車で', tag: 'JR山陰本線', body: '「梅小路京都西」駅から徒歩約5分。京都駅中央出口から徒歩約20分。', detail: '所要時間は目安です。', url: accessUrl },
    { title: '駐車場', tag: '敷地内コインパーキング', body: '台数に限りがあり、予約や提携駐車場はありません。', detail: '満車時は近隣の駐車場をご利用ください。料金は公式案内でご確認ください。', url: accessUrl },
  ];
}

export function reservationFromQr(raw: string): string | null {
  const value = raw.trim().toUpperCase();
  if (value === demoCode) return demoCode;
  return value === 'POTEL-DEMO:' + demoCode + ':NOT-VALID-FOR-CHECKIN' ? demoCode : null;
}
