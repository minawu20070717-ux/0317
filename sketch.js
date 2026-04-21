let input;
let slider;
let btn;
let isBouncing = false;
let selectMenu;
let iframeDiv;
let iframe;

// 依序顯示文字的顏色陣列
let colors = ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'];

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 建立一個文字輸入框，並預設一些文字
  input = createInput('p5.js 互動測試');
  // 將輸入框放置在視窗的左上角
  input.position(20, 20);
  // 設定文字框尺寸。為了方便使用者看見完整文字，這裡將寬度設為較大的 300px，高度則為指定的 50px
  input.size(300, 50); 
  // 文字方框輸入的文字設定為 30px 大小
  input.style('font-size', '30px');
  
  // 產生滑桿：範圍 15 到 80，預設數值為 30
  slider = createSlider(15, 80, 30);
  // 放置於 input 右方距離 20px，並與 input 對齊高度置中 (假設滑桿預設高度約 15px)
  slider.position(input.x + 300 + 20, input.y + (50 - 15) / 2); 
  
  // 產生跳動開關按鈕
  btn = createButton('跳動開關');
  // 放置於 slider 右方距離 20px (假設 slider 預設寬度約 130px)
  btn.position(slider.x + 130 + 20, input.y + (50 - 30) / 2);
  btn.style('font-size', '20px');
  btn.style('height', '30px');
  // 按鈕點擊事件：切換跳動狀態 (開關)
  btn.mousePressed(() => {
    isBouncing = !isBouncing;
  });

  // 產生下拉式選單
  selectMenu = createSelect();
  // 放置於按鈕右方距離 20px (假設按鈕寬度約 120px)
  selectMenu.position(btn.x + 120 + 20, input.y + (50 - 30) / 2);
  selectMenu.style('font-size', '20px');
  selectMenu.style('height', '30px');
  selectMenu.option('淡江教科系', 'https://www.et.tku.edu.tw');
  selectMenu.option('淡江大學', 'https://www.tku.edu.tw');
  // 當選單變更時，改變 iframe 的 src 網址
  selectMenu.changed(() => {
    iframe.attribute('src', selectMenu.value());
  });

  // 產生 iframeDiv (位於整個視窗中間，四周留 200px 內距)
  iframeDiv = createDiv();
  iframeDiv.position(200, 200);
  iframeDiv.size(windowWidth - 400, windowHeight - 400);
  iframeDiv.style('opacity', '0.95'); // 設定透明度為 95%
  iframeDiv.style('background-color', '#fff'); // 加一層白底避免背景文字完全蓋過 iframe
  
  // 建立 iframe 放進 iframeDiv 內
  iframe = createElement('iframe');
  iframe.parent(iframeDiv);
  iframe.size('100%', '100%');
  iframe.style('border', 'none');
  iframe.attribute('src', selectMenu.value()); // 預設顯示選單選擇的第一個網址
  
  // 設定文字對齊方式：水平靠左，垂直置中
  textAlign(LEFT, CENTER);
}

function draw() {
  // 設定背景顏色，每次重繪時清除上一幀的畫面
  background(240);
  
  // 取得使用者在輸入框中輸入的文字
  let txt = input.value();
  
  // 文字大小綁定滑桿數值
  textSize(slider.value());
  
  // 確保輸入框內有文字才進行繪製，避免程式出錯或無窮迴圈
  if (txt.length > 0) {
    // 為了讓重複的文字之間有間隔，我們在文字後面加上一些空格來計算寬度
    let spacing = "   "; 
    let step = textWidth(txt + spacing);
    
    // 雙重迴圈：從 y 座標 100 開始往下，間隔 50px 產生整排文字
    for (let y = 100; y < height; y += 50) {
      let colorIndex = 0; // 每一行開始時重新計算顏色索引
      for (let x = 0; x < width; x += step) {
        // 設定對應的顏色
        fill(colors[colorIndex % colors.length]);
        
        let dx = 0;
        let dy = 0;
        // 處理跳動邏輯
        if (isBouncing) {
          // 使用 Perlin noise() 確保跳動隨時間與位置平滑變化，營造出自然的動態感
          let time = millis() * 0.005;
          dx = map(noise(x * 0.01, y * 0.01, time), 0, 1, -15, 15);
          dy = map(noise(x * 0.01 + 100, y * 0.01 + 100, time), 0, 1, -15, 15);
        }
        
        // 在加上偏移量 (dx, dy) 的座標點上繪製文字
        text(txt, x + dx, y + dy);
        
        colorIndex++; // 下一個文字使用陣列的下一個顏色
      }
    }
  }
}

// 當視窗大小改變時，動態調整畫布與 iframeDiv 大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  iframeDiv.size(windowWidth - 400, windowHeight - 400); // 確保始終維持內距 200px
}
