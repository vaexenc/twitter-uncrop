(function() {
	"use strict";

	function getRetweetElementFromArticle(article) {
		return Array.from(article.querySelectorAll("div")).filter(
			function(e) {
				let arr = Array.from(e.classList);
				if (arr.length == 2 && arr.includes("css-1dbjc4n") && arr.includes("r-156q2ks")) {
					return true;
				}
			}
		)[0];
	}

	function getParentContainerFromImage(image) { // is either main tweet content or retweet content

	}

	// .css-1dbjc4n.r-18bvks7.r-1867qdf.r-1phboty.r-rs99b7.r-156q2ks.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg
	// document.querySelectorAll("div[class='css-1dbjc4n r-156q2ks']")

	setInterval(function() {
		const articles = document.querySelectorAll("article:not([data-uncropped])");

		for (let article of articles) {
			// article.setAttribute("style", "opacity: 0.1");

			const images = article.querySelectorAll("img[alt=Image]");

			if (images.length == 0) {
				return;
			}

			let aAndImageURLs = [];

			for (let image of images) {
				const a = image.closest("a");
				if (!a) {
					continue;
				}

				aAndImageURLs.push(
					{
						a: a,
						imageUrl: image.src
					}
				);
			}

			// r-18bvks7
			// css-1dbjc4n r-156q2ks
			// Array.from(document.querySelectorAll("div")).filter(function(e){let arr = Array.from(e.classList); if(arr.length==2 && arr.includes("css-1dbjc4n") && arr.includes("r-156q2ks")) {return true;}})

			let contentArea = aAndImageURLs[0].a.closest("div[class*=r-156q2ks][class*=r-18bvks7]").parentElement;
			contentArea.textContent = "TEST TEST TEST TEST TEST TEST TEST TEST";

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
