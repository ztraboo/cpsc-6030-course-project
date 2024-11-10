import { EffectCallback, useEffect, useRef, MutableRefObject, useState } from "react";

interface PassedChartDimensions {
	marginTop: number;
	marginRight: number;
	marginBottom: number;
	marginLeft: number;
}

interface CombinedChartDimensions {
	height: number;
	width: number;
	marginTop?: number;
	marginRight?: number;
	marginBottom?: number;
	marginLeft?: number;
	dimensions: {
		marginTop: number;
		marginRight: number;
		marginBottom: number;
		marginLeft: number;
	};
}

const combineChartDimensions = (dimensions: CombinedChartDimensions) => {
	const parsedDimensions = {
		...dimensions,
		marginTop: dimensions.marginTop || 10,
		marginRight: dimensions.marginRight || 10,
		marginBottom: dimensions.marginBottom || 40,
		marginLeft: dimensions.marginLeft || 75,
	};
	return {
		...parsedDimensions,
		boundedHeight: Math.max(
			parsedDimensions.height -
				parsedDimensions.marginTop -
				parsedDimensions.marginBottom,
			0
		),
		boundedWidth: Math.max(
			parsedDimensions.width -
				parsedDimensions.marginLeft -
				parsedDimensions.marginRight,
			0
		),
	};
};

const useChartDimensions = (passedSettings: PassedChartDimensions) => {
	const ref = useRef() as MutableRefObject<HTMLDivElement>;
	
	const dimensions = combineChartDimensions(
		{
			height: 0,
			width: 0,
			dimensions: {
				marginTop: passedSettings.marginTop,
				marginRight: passedSettings.marginRight,
				marginBottom: passedSettings.marginBottom,
				marginLeft: passedSettings.marginLeft,
			}
		}
	);
	
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);

	useEffect(():any => {
		if (dimensions.width && dimensions.height) return [ref, dimensions];

		// const element = ref.current as unknown as Element;
		const element = ref.current as unknown as Element;

		// if (!element) return;

		// Todo: Need to figure this out. Remove this code.
		// if (element === undefined) {
		// 	return {
		// 		height: 0,
		// 		width: 0,
		// 		dimensions: {
		// 			marginTop: passedSettings.marginTop,
		// 			marginRight: passedSettings.marginRight,
		// 			marginBottom: passedSettings.marginBottom,
		// 			marginLeft: passedSettings.marginLeft,
		// 		}
		// 	};	
		// }

		const resizeObserver = new ResizeObserver((entries) => {
			if (!Array.isArray(entries)) return;
			if (!entries.length) return;

			const entry = entries[0];

			if (width !== entry.contentRect.width)
				setWidth(entry.contentRect.width);
			if (height !== entry.contentRect.height)
				setHeight(entry.contentRect.height);
		});
		// resizeObserver.observe(element);
		if (element !== undefined) {
			resizeObserver.observe(element);
			return () => resizeObserver.unobserve(element);
		}

		return () => undefined;
		// return () => resizeObserver.unobserve(element);
	}, []);

	const newSettings = combineChartDimensions({
		...dimensions,
		width: dimensions.width || width,
		height: dimensions.height || height,
	});

	return [ref, newSettings];
};

export default useChartDimensions;
