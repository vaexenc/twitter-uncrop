(function() {
	"use strict";

	function getMainImageContainerFromArticle(article) {
		const query = article.querySelector(".css-1dbjc4n.r-18bvks7.r-1867qdf.r-1phboty.r-rs99b7.r-156q2ks.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg");
		if (query)
			return query.parentElement; // todo https://github.com/jshint/jshint/issues/3448
	}

	// function getRetweetElementFromArticle(article) {
	// 	return article.querySelector("div[class='css-1dbjc4n r-156q2ks']");
	// }

	setInterval(function() {
		const articles = document.querySelectorAll("article:not([data-uncropped])");

		for (let article of articles) {
			const imageContainer = getMainImageContainerFromArticle(article);
			if (!imageContainer) {
				continue;
			}

			// const images = imageContainer.querySelectorAll("img[alt=Image]");

			// let aAndImageURLs = [];

			// for (let image of images) {
			// 	const a = image.closest("a");
			// 	if (!a) {
			// 		continue;
			// 	}

			// 	aAndImageURLs.push(
			// 		{
			// 			a: a,
			// 			imageUrl: image.src
			// 		}
			// 	);
			// }

			imageContainer.textContent = "TEST TEST TEST TEST TEST TEST TEST TEST";

			// for (let x of aAndImageURLs) {
			// 	let img = document.createElement("img");
			// 	img.src = x.imageUrl;
			// 	img.style = "width: 100%;"
			// 	contentArea.appendChild(img);
			// }

			article.setAttribute("data-uncropped", "");
		}
	}, 400);
})();
