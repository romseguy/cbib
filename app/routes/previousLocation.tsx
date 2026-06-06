let previousLocation;
export default (p?: string) => (p ? (previousLocation = p) : previousLocation);
