import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function NotIn(property: string, validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      // registerDecorator는  ValidationDecoratorOptions를 받는다
      name: 'NotIn',
      target: object.constructor, // 이 데코레이터는 객체 생성시 적용된다.
      propertyName,
      options: validationOptions,
      constraints: [property], // 이 데코레이터는 속성에 적용되도록 제약을 주었다.
      validator: {
        // 유효성 검사 규칙이 기술된다.
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return (
            typeof value === 'string' &&
            typeof relatedValue === 'string' &&
            !relatedValue.includes(value)
          );
        },
      },
    });
  };
}
