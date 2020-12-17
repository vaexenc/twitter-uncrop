// ==UserScript==
// @name        Twitter Image Uncropper
// @version     0.1.0
// @author      vaexenc
// @description Uncrops images in tweets.
// @homepage    https://github.com/vaexenc
// @source      https://github.com/vaexenc/twitter-uncrop
// @icon64
// @include     https://twitter.com/*
// @include     https://mobile.twitter.com/*
// @grant       none
// ==/UserScript==

(function() {
	"use strict";

	const APPROXIMATE_MAIN_IMAGE_CONTAINER_SELECTOR = ".css-1dbjc4n.r-18bvks7.r-1867qdf.r-1phboty.r-rs99b7.r-156q2ks.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg";
	const IMAGE_STYLE = "width: 100%; margin-top: 5px; margin-bottom: 3px";

	function getMainImageContainerFromApproximateMainImageContainer(imageContainer) {
		return imageContainer.parentElement;
	}

	function sanitizeImageA(a) {
		a.classList = null;
		a.textContent = "";
	}

	function getHighQualityImageURLfromImage(image) {
		return image.src.replace(/name=\w+/, "name=orig");
	}

	function createImage(imageUrl) {
		const image = document.createElement("img");
		image.src = imageUrl;
		image.style = IMAGE_STYLE;
		return image;
	}

	// function getRetweetContainerFromArticle(article) {
	// 	return article.querySelector("div[class='css-1dbjc4n r-156q2ks']");
	// }

	const observerTarget = document.querySelector("html");
	const observerConfig = {childList: true, subtree: true};

	const observerCallback = function(mutationsList) {
		for (const mutation of mutationsList) {
			if (!mutation.addedNodes) {return;}
			for (const addedNode of mutation.addedNodes) {
				if (addedNode.tagName !== "IMG" || !addedNode.src.includes("&name=")) {continue;}
				const image = addedNode;
				const imageA = image.closest("a");
				const approximateMainImageContainer = image.closest(APPROXIMATE_MAIN_IMAGE_CONTAINER_SELECTOR);
				const mainImageContainer = getMainImageContainerFromApproximateMainImageContainer(approximateMainImageContainer);
				approximateMainImageContainer.style.setProperty("display", "none");
				approximateMainImageContainer.hidden = "true"; // ?
				sanitizeImageA(imageA);
				mainImageContainer.append(imageA);
				const newImage = createImage(getHighQualityImageURLfromImage(image));
				imageA.append(newImage);
			}
		}
	};

	const observer = new MutationObserver(observerCallback);
	observer.observe(observerTarget, observerConfig);
})();
