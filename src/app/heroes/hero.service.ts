import { Injectable } from '@angular/core';
import { Hero } from '../hero';
import { HEROES } from "../mock-heros";
import { MessageService } from "../messages/message.service";

@Injectable({
  // 根注入器将本服务注册为提供商 —— 提供 HeroService 服务
  providedIn: 'root'
})
export class HeroService {

  constructor(public messageService: MessageService) { }

  getHeroes(): Promise<Hero[]> {
    this.messageService.add('HeroService: fetching heroes')
    return Promise.resolve(HEROES)
      .then(heroes => {
        this.messageService.add('HeroService: fetched heroes')
        console.log(this.messageService.messages);
        
        return heroes
      })
  }
}
