

// console.log('test')
const form = document.getElementById("contactForm");


// ==============================
// フォーム内容を {key: value} に変換
// ==============================

function getFormData() {
    console.log('testttt')
    const formData = new FormData(form);
    const data = {};

    for (const [key, value] of formData.entries()) {

        // 同じnameが複数ある場合
        if (key in data) {

            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }

        } else {
            data[key] = value;
        }
    }

    return data;
}


// ==============================
// 送信
// ==============================

form.addEventListener("submit", function (event) {

    event.preventDefault();

    //     // HTMLのrequiredなどのバリデーション
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const data = getFormData();

    //     // 確認用
    console.log(data);


    //     // JSONにしたい場合
    //     const json = JSON.stringify(data);

    //     console.log(json);

    alert("お問い合わせ内容を取得しました。");

});




async function searchAddress(event) {

    event.preventDefault();

    const zipcodeInput = document.getElementById("zipcode");
    const addressInput = document.getElementById("address");

    // 入力された郵便番号
    const zipcode = zipcodeInput.value.replace(/[^\d]/g, "");

    console.log("入力された郵便番号:", zipcode);

    // 7桁チェック
    if (!/^\d{7}$/.test(zipcode)) {
        console.log("郵便番号が7桁ではありません");
        // alert("郵便番号を7桁で入力してください。");
        return;
    }

    try {

        console.log("zipcloudに問い合わせ中...");

        const response = await fetch(
            `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`
        );

        console.log("API response:", response);

        const data = await response.json();

        console.log("zipcloudから取得したデータ:", data);

        if (
            data.status !== 200 ||
            !data.results ||
            data.results.length === 0
        ) {
            console.log("住所が見つかりませんでした");
            alert("住所が見つかりませんでした。");
            return;
        }

        const result = data.results[0];

        console.log("都道府県:", result.address1);
        console.log("市区町村:", result.address2);
        console.log("町域:", result.address3);

        const address =
            result.address1 +
            result.address2 +
            result.address3;

        console.log("取得した住所:", address);

        // 住所欄に入力
        addressInput.value = address;

        // 住所欄にフォーカス
        addressInput.focus();

    } catch (error) {

        console.error("住所検索エラー:", error);

        alert("住所検索に失敗しました。");

    }
}



const submitBtn = document.getElementById("submitBtn");
const formError = document.getElementById("formError");

submitBtn.addEventListener("click", function (event) {

    event.preventDefault();

    // エラーをリセット
    formError.innerHTML = "";
    formError.classList.remove("is-visible");

    const errors = [];


    // ========================================
    // 必須入力チェック
    // ========================================

    const requiredFields = form.querySelectorAll(
        "input[required], textarea[required], select[required]"
    );

    requiredFields.forEach(function (field) {

        // ラジオボタンは後でチェックするので除外
        if (field.type === "radio") {
            return;
        }

        // チェックボックスも後でチェック
        if (field.type === "checkbox") {
            return;
        }

        if (!field.value.trim()) {

            const label = getFieldLabel(field);

            if (!errors.includes(label)) {
                errors.push(label);
            }
        }
    });


    // ========================================
    // お問い合わせ種別
    // ========================================

    const inquiryType = form.querySelector(
        'input[name="お問い合わせ種別"]:checked'
    );

    if (!inquiryType) {
        errors.push("お問い合わせ種別");
    }


    // ========================================
    // 営業目的ではありません
    // ========================================

    const notSales = document.getElementById("notSales");

    if (notSales && !notSales.checked) {
        errors.push("「営業目的ではありません」の確認");
    }


    // ========================================
    // プライバシーポリシー
    // ========================================

    const privacyPolicy =
        document.getElementById("privacyPolicy");

    if (privacyPolicy && !privacyPolicy.checked) {
        errors.push("プライバシーポリシーへの同意");
    }


    // ========================================
    // エラー表示
    // ========================================

    if (errors.length > 0) {

        formError.innerHTML =
            "<p>以下の項目をご確認ください。</p>" +
            errors
                .map(function (error) {
                    return "<p>・" + error + "</p>";
                })
                .join("");

        formError.classList.add("is-visible");

        // エラー表示位置までスクロール
        formError.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        return;
    }


    // ========================================
    // エラーがなければ送信処理
    // ========================================

    const data = getFormData();

    console.log("送信データ:", data);

});