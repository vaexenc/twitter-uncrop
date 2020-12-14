(function() {
	// "use strict";

	function getMainImageContainerFromArticle(article) {
		const query = article.querySelector(".css-1dbjc4n.r-18bvks7.r-1867qdf.r-1phboty.r-rs99b7.r-156q2ks.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg");
		if (query) {return query.parentElement;} // todo https://github.com/jshint/jshint/issues/3448
	}

	// function getRetweetContainerFromArticle(article) {
	// 	return article.querySelector("div[class='css-1dbjc4n r-156q2ks']");
	// }

	setInterval(function() {
		const articles = document.querySelectorAll("article:not([data-uncropped])");

		articles.forEach(function(article) {
			const imageContainer = getMainImageContainerFromArticle(article);
			if (!imageContainer) {return undefined;}

			const images = imageContainer.querySelectorAll("img[alt=Image]");
			if (images.length === 0) {return undefined;} // if they haven't been added yet

			const aAndImageURLs = [];

			images.forEach(function(image) {
				// const a = image.closest("a");
				aAndImageURLs.push(
					{
						// a: a,
						imageUrl: image.src.replace(/name=\w+/, "name=orig")
					}
				);
			});

			imageContainer.textContent = "";

			aAndImageURLs.forEach(function(aAndImageURL) {
				let img = document.createElement("img");
				img.src = aAndImageURL.imageUrl;
				img.style = "width: 100%; margin-top: 5px; margin-bottom: 3px";
				imageContainer.appendChild(img);
			});

			article.setAttribute("data-uncropped", "");
		});
	}, 600);
}());
