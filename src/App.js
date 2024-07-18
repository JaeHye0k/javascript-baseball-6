import { Console } from "@woowacourse/mission-utils";
import { Random } from "@woowacourse/mission-utils";

const LENGTH = 3;
const START_NUM = 1;
const END_NUM = 9;

class App {
	async play() {
		Console.print("숫자 야구 게임을 시작합니다.");
		while (true) {
			const computer = this.getRandomNumbers(START_NUM, END_NUM, LENGTH);
			while (true) {
				const user = await this.getUserNumbers();
				const { strike, ball } = this.compareNumbers(computer, user);
				const result = this.getResult(strike, ball);
				Console.print(result);
				if (strike === LENGTH) {
					Console.print(
						`${LENGTH}개의 숫자를 모두 맞히셨습니다! 게임 종료`
					);
					const isEnd = await this.restartOrExit();
					if (isEnd) return;
					else break;
				}
			}
		}
	}

	getRandomNumbers(start, end, length) {
		const computer = [];
		while (computer.length < length) {
			const randomNumber = Random.pickNumberInRange(start, end);
			computer.push(randomNumber);
		}
		return computer;
	}

	async getUserNumbers() {
		const input = await Console.readLineAsync("숫자를 입력해주세요 : ");
		const nums = input.split("").map(Number);
		const isValid = this.checkIsValidUserInput(nums);
		if (!isValid) throw new Error("[ERROR]");
		return nums;
	}

	checkIsValidUserInput(nums) {
		const correctLength = nums.length === LENGTH;
		const everyThingIsNumber = nums.every((e) => !isNaN(e) && e !== 0);
		const noDuplicate = nums.length === new Set(nums).size;
		return correctLength && everyThingIsNumber && noDuplicate;
	}

	compareNumbers(computer, user) {
		let strike = 0;
		let ball = 0;
		for (let i = 0; i < LENGTH; i++) {
			if (computer[i] === user[i]) strike++;
			else if (computer.includes(user[i])) ball++;
		}
		return { strike, ball };
	}

	getResult(strike, ball) {
		if (!strike && !ball) return "낫싱";
		else if (strike && !ball) return strike + "스트라이크";
		else if (!strike && ball) return ball + "볼";
		else return `${ball}볼 ${strike}스트라이크`;
	}

	async restartOrExit() {
		const answer = +(await Console.readLineAsync(
			"게임을 새로 시작하려면 1, 종료하려면 2를 입력하세요.\n"
		));
		if (!isNaN(answer) && (answer === 1 || answer === 2)) {
			if (answer === 1) return false;
			else if (answer === 2) return true;
		} else throw new Error("[ERROR]");
	}
}

const app = new App();
app.play();
export default App;
