(function() {
	"use strict";

	function getMainImageContainerFromArticle(article) {
		const query = article.querySelector(".css-1dbjc4n.r-18bvks7.r-1867qdf.r-1phboty.r-rs99b7.r-156q2ks.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg");
		if (query) return query.parentElement; // todo https://github.com/jshint/jshint/issues/3448
	}

	// function getRetweetContainerFromArticle(article) {
	// 	return article.querySelector("div[class='css-1dbjc4n r-156q2ks']");
	// }

	setInterval(function() {
		const articles = document.querySelectorAll("article:not([data-uncropped])");

		for (let article of articles) {
			const imageContainer = getMainImageContainerFromArticle(article);

			if (!imageContainer) {
				continue;
			}

			const images = imageContainer.querySelectorAll("img[alt=Image]");
			const aAndImageURLs = [];

			for (let image of images) {
				const a = image.closest("a");
				aAndImageURLs.push(
					{
						a: a,
						imageUrl: image.src
					}
				);
			}

			imageContainer.textContent = "";
			
			for (let aAndImageURL of aAndImageURLs) {
				console.log("aaaaaa", aAndImageURLs[0].a);
				let img = document.createElement("img");
				img.src = aAndImageURL.imageUrl;
				img.style = "width: 100%; margin-bottom: 10px";
				imageContainer.appendChild(img);
			}

			article.setAttribute("data-uncropped", "");
		}
	}, 600);
})();
