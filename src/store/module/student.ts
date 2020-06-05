import {
	VuexModule,
	Module,
	Mutation,
	Action,
	getModule,
} from "vuex-module-decorators";
import store from "@/store";

@Module({ name: "student", dynamic: true, namespaced: true, store })
export default class Student extends VuexModule {
	public knowledge_power: number | string | null = localStorage.getItem(
		"st_knowledge_power"
	)
		? localStorage.getItem("st_knowledge_power")
		: 0;

	@Mutation
	private SET_KNOWLEDGE_POWER(val: number): void {
		this.knowledge_power = val;
		localStorage.st_knowledge_power = val;
	}

	@Action
	public UPDATA_KNOWLEDGE_POWER(knowledge_power: number): void {
		this.SET_KNOWLEDGE_POWER(knowledge_power);
	}
}

export const UserModule = getModule(Student);
