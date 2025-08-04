export abstract class BaseController {
  constructor() {
    const proto = Object.getPrototypeOf(this);

    Object.getOwnPropertyNames(proto)
      .filter((key) => key !== 'constructor')
      .forEach((key) => {
        const descriptor = Object.getOwnPropertyDescriptor(proto, key);
        if (descriptor && typeof descriptor.value === 'function') {
          // Bind the method to the instance
          this[key as keyof this] = descriptor.value.bind(this);
        }
      });
  }
}