export function getSize() {
	const { innerWidth: width, innerHeight: height } = window
	const aspect = width / height
	return { width, height, aspect }
}
