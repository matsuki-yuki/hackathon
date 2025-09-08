// --- 1. HTML要素の取得 ---
const categorySelect = document.getElementById('category-select');
// const nameSelect = document.getElementById('itemName-select'); // 削除
const timeSelect = document.getElementById('itemTime-select');
const locationSelect = document.getElementById('itemLocation-select');
const contentArea = document.getElementById('content-area');

// 【追加】モーダル関連の要素
const imageModal = document.getElementById('image-modal');
const modalImage = document.getElementById('modal-image');
const modalCloseBtn = document.querySelector('.modal-close-btn');
const modalOverlay = document.querySelector('.modal-overlay');

// すべての落とし物データを保存する配列
let allItems = [];

// --- 2. フィルターの選択肢を動的に生成する関数 ---
function populateFilters(items) {
    // Setを使って重複しない値のリストを作成
    // const names = [...new Set(items.map(item => item.name))]; // 削除
    const times = [...new Set(items.map(item => item.time))];
    const locations = [...new Set(items.map(item => item.location))];

    // <select>要素に<option>を追加するヘルパー関数
    const addOptions = (selectElement, options) => {
        if (!selectElement) return;

        options.sort().forEach(optionValue => {
            const option = document.createElement('option');
            option.value = optionValue;
            option.textContent = optionValue;
            selectElement.appendChild(option);
        });
    }

    // addOptions(nameSelect, names); // 削除
    addOptions(timeSelect, times);
    addOptions(locationSelect, locations);
}
/*
// --- 3. 絞り込み結果を描画する関数 ---
function renderItems(items) {
    if (items.length === 0) {
        contentArea.innerHTML = '<p class="no-items">該当する落とし物はありません。</p>';
        return;
    }

    let htmlResult = '';
    for (const item of items) {
        htmlResult += `
            <div class="lost-item">
                <span class="item-name">${item.name}</span>
                <div class="item-details">
                    <div class="item-time"> 時間: ${item.time}</div>
                    <div class="item-location"> 場所: ${item.location}</div>
                </div>
            </div>
        `;
    }
    contentArea.innerHTML = htmlResult;
}
*/

// --- 3. 絞り込み結果を描画する関数 (修正) ---
function renderItems(items) {
    // 古いイベントリスナーを削除（重複防止）
    contentArea.innerHTML = '';
    
    if (items.length === 0) {
        contentArea.innerHTML = '<p class="no-items">該当する落とし物はありません。</p>';
        return;
    }

    for (const item of items) {
        // 新しい要素を作成
        const itemElement = document.createElement('div');
        itemElement.className = 'lost-item';
        
        // 品名をクリック可能にする
        const nameSpan = document.createElement('span');
        nameSpan.className = 'item-name item-name-clickable';
        nameSpan.textContent = item.name;
        
        // 画像がない場合はクリック不可にする
        if (item.image) {
            nameSpan.addEventListener('click', () => showModal(item.image));
        } else {
            nameSpan.classList.remove('item-name-clickable');
        }

        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'item-details';
        detailsDiv.innerHTML = `
            <div class="item-time">🕒  ${item.time}</div>
            <div class="item-location">⛺️  ${item.location}</div>
        `;
        
        itemElement.appendChild(nameSpan);
        itemElement.appendChild(detailsDiv);
        contentArea.appendChild(itemElement);
    }
}

// --- 4. フィルタリングと表示を実行するメイン関数 ---
function filterAndDisplay() {
    // 各フィルターで選択されている値を取得
    const selectedCategory = categorySelect.value;
    // const selectedName = nameSelect.value; // 削除
    const selectedTime = timeSelect.value;
    const selectedLocation = locationSelect.value;

    // allItems配列から条件に合うものだけを絞り込む
    const filteredItems = allItems.filter(item => {
        const categoryMatch = (selectedCategory === 'all') || (item.category === selectedCategory);
        // const nameMatch = (selectedName === 'all') || (item.name === selectedName); // 削除
        const timeMatch = (selectedTime === 'all') || (item.time === selectedTime);
        const locationMatch = (selectedLocation === 'all') || (item.location === selectedLocation);
        
        // nameMatch を条件から削除
        return categoryMatch && timeMatch && locationMatch;
    });

    renderItems(filteredItems);
}

// ---【追加】モーダル表示/非表示の関数 ---
function showModal(imageSrc) {
    modalImage.src = imageSrc;
    imageModal.classList.remove('modal-hidden');
    imageModal.classList.add('modal-visible');
}

function hideModal() {
    imageModal.classList.remove('modal-visible');
    imageModal.classList.add('modal-hidden');
    modalImage.src = ''; // 画像のソースをクリア
}

// --- 5. 初期化処理 ---
// JSONファイルを読み込んで処理を開始
fetch('txt/lostpropety.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('ファイルの読み込みに失敗しました。');
        }
        return response.json();
    })
    .then(data => {
        allItems = data;
        populateFilters(allItems);
        filterAndDisplay();
    })
    .catch(error => {
        console.error('Fetch Error:', error);
        contentArea.innerHTML = '<p class="error">エラー: データファイルを読み込めませんでした。</p>';
    });

// --- 6. イベントリスナーの設定 ---
// 各ドロップダウンメニューが変更されたら、再度フィルタリングを実行
const selectors = [categorySelect, timeSelect, locationSelect]; // nameSelectを削除
selectors.forEach(select => {
    if (select) {
        select.addEventListener('change', filterAndDisplay);
    }
});

//【追加】モーダルを閉じるイベント
modalCloseBtn.addEventListener('click', hideModal);
modalOverlay.addEventListener('click', hideModal);