import { Injectable, Type } from '@nestjs/common';
import { Policy } from './interfaces/policy.interface';
import { PolicyHandler } from './interfaces/policy-handler.interface';

@Injectable()
export class PolicyHandlerStorage {
  private readonly collection = new Map<Type<Policy>, PolicyHandler<any>>();

  add<T extends Policy>(policyClass: Type<T>, handler: PolicyHandler<T>) {
    this.collection.set(policyClass, handler);
  }

  get<T extends Policy>(policyClass: Type<T>): PolicyHandler<T> | undefined {
    const handler = this.collection.get(policyClass);
    if (!handler) {
      throw new Error(
        `"${policyClass.name}" does not have an associated handler.`,
      );
    } else {
      return handler;
    }
  }
}
