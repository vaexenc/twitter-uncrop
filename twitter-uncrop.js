(function() {
	"use strict";
	// setInterval(function() {
	
	let articles = document.querySelectorAll("article:not([data-uncropped])");

	for (let article of articles) {
		let images = article.querySelectorAll("img[alt=Image]");

		if (images.length == 0) {
			return;
		}

		let aAndImageURLs = [];

		for (let image of images) {
			aAndImageURLs.push(
				{
					a: image.closest("a"),
					imageUrl: image.src
				}
			);
		}
		
		let contentArea = aAndImageURLs[0].a.closest("div[class*=r-156q2ks][class*=r-18bvks7]").parentElement;
		article.setAttribute("data-uncropped", "");
		contentArea.textContent = "TEST TEST TEST TEST TEST TEST TEST TEST";
		// for (let x of aAndImageURLs) {
		// 	let img = document.createElement("img");
		// 	img.src = x.imageUrl;
		// 	img.style = "width: 100%;"
		// 	contentArea.appendChild(img);
		// }
	}

	// }, 300);
})();
