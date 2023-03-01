/// <reference lib="chai" />
declare const expect: Chai.ExpectStatic

interface JSSpecOptions {
  /**
   * Override timeout in milliseconds. Set to zero to disable timeout
   */
  timeout: number
}

/**
 * Run before every example block
 * @param description Description of the call block, used in output when an error occurs
 */
declare function beforeEach(description?: string, options?: JSSpecOptions, callback: Function): void

/**
 * Run after every example block
 * @param description Description of the call block, used in output when an error occurs
 */
declare function afterEach(description?: string, options?: JSSpecOptions, callback: Function): void

/**
 * Run after every example block
 * @param description Description of the call block, used in output when an error occurs
 */
declare function aroundEach(description?: string, options?: JSSpecOptions, callback: Function): void

/**
 * Run before the first example in this context block. Runs only once.
 * Will not be run if no examples in the block are executed
 * @param description Description of the call block, used in output when an error occurs
 */
declare function before(description?: string, options?: JSSpecOptions, callback: Function): void

/**
 * Run after the final example in this context block. Runs only once.
 * Will not be run if no examples in the block are executed
 * @param description Description of the call block, used in output when an error occurs
 */
declare function after(description?: string, options?: JSSpecOptions, callback: Function): void

/**
 * Describe a specific context, any lazy evaluators defined inside this block will be local to
 * this block only.
 * @param description Description of the call block, used in output when an error occurs
 */
declare function context(description?: string, options?: JSSpecOptions, callback: Function): void

/**
 * Describe a specific context, any lazy evaluators defined inside this block will be local to
 * this block only.
 * @param description Description of the call block, used in output when an error occurs
 */
declare function describe(description?: string, options?: JSSpecOptions, callback: Function): void

/**
 * Declare an example
 * @param description Description of the call block, used in output when an error occurs
 */
declare function it(description?: string, options?: JSSpecOptions, callback: Function): void

/**
 * Lazy evaluation function, will be evaluated when the value is first used.
 */
declare type JSSpecLazyFunction = () => any;

/**
 * Define a global, overrideable value that is re-initialised at the start of each example block
 * To return a function as the value, return the desired function from a wrapping void function
 */
declare function set(name: string, value: JSSpecLazyFunction): void

/**
 * Define a global, overrideable value that is re-initialised at the start of each example block
 */
declare function set(name: string, value: any): void

/**
 * Define a global, overrideable value that is re-initialised at the start of each example block
 * To return a function as the value, return the desired function from a wrapping void function
 */
declare function subject(name?: string, value: JSSpecLazyFunction): void

/**
 * Define a global, overrideable value that is re-initialised at the start of each example block
 */
declare function subject(name?: string, value: any): void

/** Ignored example */
declare function xit(description?: string, options?: JSSpecOptions, callback: Function): void

/** Ignored describe */
declare function xdescribe(description?: string, options?: JSSpecOptions, callback: Function): void

/** Ignored context */
declare function xcontext(description?: string, options?: JSSpecOptions, callback: Function): void
