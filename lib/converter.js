function itemToRSS(item) {
  /**
   * 自己发视频动态的情况
   * card.title
   * card.pic
   * card.desc
   * https://www.bilibili.com/video/av${desc.rid}/ type = 8 type = 256
   * desc.timestamp
   * 
   * 自己发动态 配照片
   * card.item.description
   * card.item.pictures[0].img_src
   * card.item.description
   * https://h.bilibili.com/${desc.rid} type = 2
   * desc.timestamp
   * 
   * 自己发动态 只有文字
   * card.item.content
   * null
   * card.item.content
   * https://t.bilibili.com/${desc.rid} type = 4
   * desc.timestamp
   * 
   * 自己转发别人的视频动态
   * card.item.content
   * card.origin.item.pictures[0].img_src
   * card.item.content
   * https://t.bilibili.com/${desc.rid} type = 1
   * desc.timestamp
   * 
   * 自己发小视频、音频动态
   * card.item.description
   * card.item.cover.default
   * card.item.description
   * https://vc.bilibili.com/video/${desc.rid} type = 16 
   * desc.timestamp
   * 
   * 自己发文章
   * card.title
   * card.image_urls[0]
   * card.summary
   * https://www.bilibili.com/read/cv${desc.rid} type = 64
   * desc.timestamp
   */
  const { desc, card } = item;
  let link = '';
  let thumbnail = '';
  let title = '';
  let description = '';

  switch(desc.type) {
    case 1: 
      title = card.item.content;
      link = `https://t.bilibili.com/${desc.rid}`; 
      thumbnail = card.origin.item ? card.origin.item.pictures[0].img_src : ''; 
      description = card.item.content;
      break;
    case 4:
      title = card.item.content;
      link = `https://t.bilibili.com/${desc.rid}`;
      description = card.item.content;
      break;
    case 2: 
      title = card.item ? card.item.description : '';
      link = `https://h.bilibili.com/${desc.rid}`; 
      thumbnail = card.item.pictures[0].img_src;
      description = card.item ? card.item.description : '';
      break;
    case 8:
    case 256: 
      title = card.title;
      link = `https://www.bilibili.com/video/av${desc.rid}/`; 
      thumbnail = card.pic;
      description = card.desc;
      break;
    case 16: 
      title = card.item.description;
      link = `https://vc.bilibili.com/video/${desc.rid}`; 
      thumbnail = card.item.cover.default;
      description = card.item.description;
      break;
    case 64:
      title = card.title;
      link = `https://www.bilibili.com/read/cv${desc.rid}`;
      thumbnail = card.image_urls[0];
      description = card.summary;
  }
  const str = `
    <item>
      <title><![CDATA[${title}]]></title>
      <description><![CDATA[${description}${generateThumbnail(thumbnail)}]]></description>
      <pubDate>${new Date(desc.timestamp * 1000).toUTCString()}</pubDate>
      <guid><![CDATA[${link}]]></guid>
      <link><![CDATA[${link}]]></link>
    </item>
  `;
  return str;
}

function generateThumbnail(thumbnail) {
  if (thumbnail) {
    return `<br><img referrerpolicy="no-referrer" src="${thumbnail}">`;
  }
  return '';
}
module.exports = itemToRSS;