export function realFormatSecond(second: any): string {
	if (second) {
		second = parseInt(second);
		var mimute = Math.floor(second / 60);
		second = second - mimute * 60;
		return ("0" + mimute).slice(-2) + ":" + ("0" + second).slice(-2);
	} else {
		return "00:00";
	}
}
