import {
    VuexModule,
    Module,
    Mutation,
    Action,
    getModule,
} from "vuex-module-decorators";
import store from "@/store";

// 参数一：module名称，开启命名空间后会以name为命名空间
// 参数二：是否使用动态加载，简而言之只有在用到当前的module才会加载，详细可以看vuex官网。
//        这也是为什么index.ts一直不用修改的原因，如果设置为false会有很大的变动
// 参数三：是否开启命名空间，如果你的模块很多，强烈建议开启
// 参数四：挂载的store目标

@Module({ name: "userInfo", dynamic: true, namespaced: true, store })
export default class UserInfo extends VuexModule {
    //token
    public Authorization: string | null = localStorage.getItem("Authorization")
        ? localStorage.getItem("Authorization")
        : "";
    //手机号
    public telephone: string | null = localStorage.getItem("tel")
        ? localStorage.getItem("tel")
        : "";
    //端
    public character: string | null = localStorage.getItem("character")
        ? localStorage.getItem("character")
        : "";

    @Mutation
    private CHANGE_AUTHORIZATION(Authorization: string): void {
        this.Authorization = Authorization;
        localStorage.setItem("Authorization", Authorization);
    }

    @Mutation
    private CHANGE_TELEPHONE(telephone: string): void {
        this.telephone = telephone;
        localStorage.setItem("tel", telephone);
    }

    @Mutation
    private CHANGE_CHARACTER(character: string): void {
        //端
        this.character = character;
        localStorage.setItem("character", character);
    }

    @Action
    public getAuthorization(Authorization: string): void {
        this.CHANGE_AUTHORIZATION(Authorization);
    }

    @Action
    public getTelephone(telephone: string): void {
        this.CHANGE_TELEPHONE(telephone);
    }

    @Action
    public getCharacter(character: string): void {
        this.CHANGE_CHARACTER(character);
    }
}

export const UserModule = getModule(UserInfo);
