
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const infoContainer = document.getElementById('infoContainer');


let allChildrenData = [];



window.addEventListener('DOMContentLoaded', () => {
    fetch('lost_children.json') // JSONファイルを指定
        .then(response => response.json()) // データをJSONとして解釈
        .then(data => {
            allChildrenData = data; // 取得したデータを全データとして保存
            displayChildren(allChildrenData); // 
        })
        .catch(error => {
            console.error('データの読み込みに失敗しました:', error);
            infoContainer.innerHTML = '<p>情報の読み込みに失敗しました。</p>';
        });
});

// 迷子情報を表示するよう
function displayChildren(childrenArray) {
    infoContainer.innerHTML = '';

    
    childrenArray.forEach(child => {
        //表示ボックスを作成
        const childBox = `
            <div class="child-box">
                <h3>${child.name}</h3>
                <p><strong>年齢:</strong> ${child.age}歳</p>
                <p><strong>現在の場所:</strong> ${child.location}</p>
            </div>
        `;
        // 作成したボックスを表示エリアに追加
        infoContainer.innerHTML += childBox;
    });
}

// 検索ボタンが押されたときの処理
searchButton.addEventListener('click', () => {
    // 入力された検索キーワードを取得
    const searchTerm = searchInput.value.trim().toLowerCase();

    // 検索キーワードが空なら、全員を再表示して処理を終了
    if (searchTerm === '') {
        displayChildren(allChildrenData);
        return;
    }

    // マッチした子と、しなかった子を分けるための配列
    const foundChildren = [];
    const otherChildren = [];

    // 全データの中から検索
    allChildrenData.forEach(child => {
        // 名前に検索キーワードが含まれていたら
        if (child.name.toLowerCase().includes(searchTerm)) {
            foundChildren.push(child); // マッチした配列に追加
        } else {
            otherChildren.push(child); // マッチしなかった配列に追加
        }
    });

    // マッチした子を先に、その後に残りの子を表示する新しい配列を作成
    const sortedList = [...foundChildren, ...otherChildren];

    // 並び替えたリストで再表示
    displayChildren(sortedList);
});
