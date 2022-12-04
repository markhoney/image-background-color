const getPixels = require("get-pixels");

const hex = (r, g, b) => '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);

const hexPixels = (pixels) => {
	const hexes = [];
	for (let i = 0; i < pixels.shape[0]; i++) {
		for (let j = 0; j < pixels.shape[1]; j++) {
			hexes.push(hex(pixels.get(i, j, 0), pixels.get(i, j, 1), pixels.get(i, j, 2)));
		}
	}
	return hexes;
};

function portion(value, proportion, inverse = false) {
	if (proportion > 0.5) proportion = proportion / 100;
	if (proportion > 0.5) proportion = 0.5;
	if (inverse) proportion = 1 - proportion;
	return Math.floor(value * proportion);
}

const mode = (myArray) => myArray.reduce((a, b, i, arr) => (arr.filter((v) => v === a).length >= arr.filter((v) => v === b).length ? a : b), null);
/* const mode = (myArray) => {
	const dict = myArray.reduce((acc, curr) => {
		if (acc[curr]) acc[curr]++;
		else acc[curr] = 1;
		return acc;
	}, {});
	return Object.keys(dict).reduce((a, b) => dict[a] > dict[b] ? a : b);
}; */

function getBackgroundColour(image, border = 1) {
	return new Promise((resolve, reject) => {
		getPixels(image, function(err, pixels) {
			if (err) reject(err);
			else {
				const top = pixels.hi(pixels.shape[0], portion(pixels.shape[1], border));
				const bottom = pixels.lo(0, portion(pixels.shape[1], border, true));
				const left = pixels.lo(portion(pixels.shape[0], border, true), 0);
				const right = pixels.hi(portion(pixels.shape[0], border), pixels.shape[1]);
				const all = [hexPixels(top), hexPixels(bottom), hexPixels(left), hexPixels(right)].flat();
				resolve(mode(all));
			}
		});
	});
}

export default getBackgroundColour;
