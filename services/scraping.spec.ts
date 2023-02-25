import chai, { assert } from "chai";
import sinon from "sinon";

const expect = chai.expect
const sandbox = sinon.createSandbox();

import { isScraping, start, stop } from "./scraping";
 
describe("Scraping", () => {

   afterEach(() => {
      stop()
      sandbox.restore()
   });

   it("should not allow negative record count", () => {
      assert.throws(() => start(-1, 10, () => true ));
   });

   it("should not allow too high record count", () => {
      assert.throws(() => start(10000, 10, () => true ));
   });

   it("should use delays", () => {
      assert.throws(() => start(100, 0, () => true ));
   });

   it("should not allow starting already running", () => {
      start(100, 100, () => true)
      assert.throws(() => start(100, 10, () => true ));
   });

   it("should report progress", (done) => {
      const progressFnStub = sandbox.stub().returns(true)
      start(40, 10, progressFnStub)
      setTimeout(() => {
         sandbox.assert.calledTwice(progressFnStub)
         done()
      }, 100)
   });

   it("should stop on false", (done) => {
      const progressFnStub = sandbox.stub().returns(false)
      start(40, 10, progressFnStub)
      setTimeout(() => {
         sandbox.assert.calledOnce(progressFnStub)
         done()
      }, 100)
   });

});