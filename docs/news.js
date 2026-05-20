
const BLOGGER_API_ID = process.env.BLOGGER_API_ID;
const BLOGGER_API_KEY = process.env.BLOGGER_API_KEY;

function get_result() {

    let url = `https://www.googleapis.com/blogger/v3/blogs/${BLOGGER_ID}/posts?key=${BLOGGER_API_KEY}`
    fetch(url)
        .then(function (resp) {
            return resp.json();
        })
        .then(function (data) {
            const bloggerdata = data.items;
            // console.log(bloggerdata)
            let AmountOfArticle = bloggerdata.length
            let titleOfArticle;
            let dateOfArticle;
            let blogUrl;
            for (let i = 0; i < 3; i++) {
                titleOfArticle = bloggerdata[i].title;
                dateOfArticle = bloggerdata[i].published;
                articleLabels = bloggerdata[i].labels;
                blogUrl = bloggerdata[i].url
                getDates(dateOfArticle)
                // console.log(articleLabels)
            }

            let createDivForWrap = document.createElement('div');
            createDivForWrap.classList.add("divForWrap");


            function getDates(dateOfArticle) {
                let year = parseInt(dateOfArticle);
                let time = new Date(dateOfArticle)
                let month = time.getMonth() + 1
                let date = time.getDate()
                let publishedDateArr = []

                publishedDateArr.push(year, month, date)
                let publishedDateArrComma = publishedDateArr.join('.')
                // console.log(publishedDateArrComma)
                appendData(publishedDateArrComma, titleOfArticle, articleLabels)
            }




            function appendData(date, titleOfArticle, articleLabels) {
                // append published date in p div

                let createDivForListWrap = document.createElement('div');
                createDivForListWrap.classList.add("createDivForListWrap");

                // wrap for label and date
                // label
                let createDivForDateLabelWrap = document.createElement('div');
                createDivForDateLabelWrap.classList.add("createDivForDateLabelWrap");

                let createPForLabel = document.createElement('p')
                createPForLabel.classList.add("createPForLabel");
                let publishedLabelArrTextnode = document.createTextNode(articleLabels)
                createPForLabel.appendChild(publishedLabelArrTextnode)

                // wrap for published date
                let createPForYear = document.createElement('p')
                createPForYear.classList.add("createPForTime");
                let publishedDateArrTextnode = document.createTextNode(date)
                createPForYear.appendChild(publishedDateArrTextnode)

                createDivForDateLabelWrap.appendChild(createPForLabel)
                createDivForDateLabelWrap.appendChild(createPForYear)
                createDivForListWrap.appendChild(createDivForDateLabelWrap)




                // wrap for title Of Article

                let createaFortitleOfArticle = document.createElement('a')
                createaFortitleOfArticle.classList.add("createaFortitleOfArticle");
                createaFortitleOfArticle.href = blogUrl


                let titleOfArticleTextnode = document.createTextNode(titleOfArticle)
                createaFortitleOfArticle.appendChild(titleOfArticleTextnode)
                createDivForListWrap.appendChild(createaFortitleOfArticle)

                let newsContentWrap = document.getElementById('news-content-wrap')
                newsContentWrap.appendChild(createDivForListWrap)


                // append img arrow

                let arrowimg = document.createElement("img");
                arrowimg.classList.add("roundarrowimg");
                arrowimg.src = "./img/arrowround.png";
                createaFortitleOfArticle.appendChild(arrowimg);


            }
            // console.log(bloggerdata[1].title)
        })
}

get_result()