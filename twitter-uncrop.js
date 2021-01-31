// ==UserScript==
// @name        Twitter Image Uncropper
// @version     0.1.0
// @description Uncrops images in tweets.
// @include     https://twitter.com/*
// @include     https://mobile.twitter.com/*
// @icon        https://i.imgur.com/aZxZzdw.png
// @author      vaexenc
// @namespace   https://github.com/vaexenc
// @grant       none
// ==/UserScript==

(function() {
	"use strict";

	const IS_RETWEETS_ENABLED = true;

	const IMAGE_URL_NAME = "orig";
	const SELECTOR_MAIN_IMAGE_CONTAINER_STARTINGPOINT = ".css-1dbjc4n.r-18bvks7.r-1867qdf.r-1phboty.r-rs99b7.r-156q2ks.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg";
	const SELECTOR_RETWEET_DIRECT_IMAGE_CONTAINER_STARTINGPOINT = "div[class='css-1dbjc4n r-1g94qm0']";
	const SELECTOR_RETWEET_TIMELINE_IMAGE_CONTAINER_STARTINGPOINT = ".css-1dbjc4n.r-k200y.r-42olwf.r-1867qdf.r-1phboty.r-dta0w2.r-1n0xq6e.r-1g94qm0.r-zg41ew.r-1udh08x";
	const SELECTOR_RETWEET_IMAGE_CONTAINER_TARGET = ".css-1dbjc4n.r-18bvks7.r-1867qdf.r-rs99b7.r-1loqt21.r-dap0kf.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg";
	const STYLE_NEWLY_INSERTED_IMAGE = "width: 100%; margin-top: 5px; margin-bottom: 3px";
	const STYLE_HIDDEN_IMAGE_CONTAINER_STARTINGPOINT = "opacity: 0; height: 0px; border-width: 0px; margin: 0px 0px 0px 0px;";
	const IMAGE_CONTAINER_CUSTOM_MARK_ATTRIBUTE = "data-uncropper-marked";

	function getMainImageContainerTargetFromMainImageContainerStartingPoint(imageContainer) {
		return imageContainer.parentElement;
	}

	function getRetweetImageContainerTargetFromRetweetImageContainerStartingPoint(imageContainer) {
		return imageContainer.closest(SELECTOR_RETWEET_IMAGE_CONTAINER_TARGET);
	}

	function sanitizeImageA(a) {
		a.classList = null;
		a.textContent = "";
	}

	function getHighQualityImageURLfromImage(image) {
		return image.src.replace(/name=\w+/, "name=" + IMAGE_URL_NAME);
	}

	function createImageElement(imageUrl, style) {
		const image = document.createElement("img");
		image.src = imageUrl;
		image.style = style;
		return image;
	}

	function getOrderNumberFromImage(image) {
		return parseInt(image.closest("a").href.match(/\d$/)[0]);
	}

	function imageArraySortFunction(image1, image2) {
		const image1OrderNumber = getOrderNumberFromImage(image1);
		const image2OrderNumber = getOrderNumberFromImage(image2);
		if (image1OrderNumber < image2OrderNumber) return -1;
		return 1;
	}

	function uncropImages(imageContainerStartingPoint, getImageContainerFunction) {
		if (!imageContainerStartingPoint || imageContainerStartingPoint.hasAttribute(IMAGE_CONTAINER_CUSTOM_MARK_ATTRIBUTE)) return;
		imageContainerStartingPoint.style.cssText += STYLE_HIDDEN_IMAGE_CONTAINER_STARTINGPOINT;
		imageContainerStartingPoint.setAttribute(IMAGE_CONTAINER_CUSTOM_MARK_ATTRIBUTE, "");
		setTimeout(function() {
			const imageContainerTarget = getImageContainerFunction(imageContainerStartingPoint);
			const images = Array.from(imageContainerStartingPoint.querySelectorAll("img"));
			images.sort(imageArraySortFunction);
			for (const image of images) {
				const newImage = createImageElement(getHighQualityImageURLfromImage(image), STYLE_NEWLY_INSERTED_IMAGE);
				const imageA = image.closest("a");
				sanitizeImageA(imageA);
				imageContainerTarget.append(imageA);
				imageA.append(newImage);
			}
			imageContainerStartingPoint.remove();
		}, 0);
	}

	function uncropMainImages(imageNode) {
		const mainImageContainerStartingPoint = imageNode.closest(SELECTOR_MAIN_IMAGE_CONTAINER_STARTINGPOINT);
		uncropImages(mainImageContainerStartingPoint, getMainImageContainerTargetFromMainImageContainerStartingPoint);
	}

	function uncropRetweetImages(imageNode) {
		const retweetImageContainerStartingPoint = imageNode.closest(SELECTOR_RETWEET_DIRECT_IMAGE_CONTAINER_STARTINGPOINT) || imageNode.closest(SELECTOR_RETWEET_TIMELINE_IMAGE_CONTAINER_STARTINGPOINT);
		uncropImages(retweetImageContainerStartingPoint, getRetweetImageContainerTargetFromRetweetImageContainerStartingPoint);
	}

	const observerTarget = document.querySelector("html");
	const observerConfig = {childList: true, subtree: true};

	const observerCallback = function(mutationsList) {
		for (const mutation of mutationsList) {
			if (!mutation.addedNodes) return;
			for (const addedNode of mutation.addedNodes) {
				if (addedNode.tagName === "IMG" && addedNode.src.includes("&name=")) {
					uncropMainImages(addedNode);
					if (IS_RETWEETS_ENABLED) uncropRetweetImages(addedNode);
				}
			}
		}
	};

	const observer = new MutationObserver(observerCallback);
	observer.observe(observerTarget, observerConfig);
})();
