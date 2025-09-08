
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const infoContainer = document.getElementById('infoContainer');


let allChildrenData = [];



window.addEventListener('DOMContentLoaded', () => {
    fetch('/txt/lostchild.json') 
        .then(response => response.json()) 
        .then(data => {
            allChildrenData = data; 
            displayChildren(allChildrenData); 
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
        
        const childBox = `
            <div class="child-box">
                <h3>${child.name}</h3>
                <p><strong>年齢:</strong> ${child.age}歳</p>
                <p><strong>現在の場所:</strong> ${child.location}</p>
                <p><strong>服装:</strong> ${child.clothing}</p>
            </div>
        `;
        
        infoContainer.innerHTML += childBox;
    });
}

// 検索ボタンが押されたときの処理
searchButton.addEventListener('click', () => {
   
    const searchTerm = searchInput.value.trim().toLowerCase();

    
    if (searchTerm === '') {
        displayChildren(allChildrenData);
        return;
    }

    
    const foundChildren = [];
    const otherChildren = [];

    // 全データの中から検索
    allChildrenData.forEach(child => {
        
        if (child.name.toLowerCase().includes(searchTerm)) {
            foundChildren.push(child); 
        } else {
            otherChildren.push(child); 
        }
    });

   
    const sortedList = [...foundChildren, ...otherChildren];

    
    displayChildren(sortedList);
});
