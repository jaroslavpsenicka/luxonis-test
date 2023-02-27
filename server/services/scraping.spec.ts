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
      assert.throws(() => start(-1, 10, () => true, () => true ));
   });

   it("should not allow too high record count", () => {
      assert.throws(() => start(10000, 10, () => true, () => true ));
   });

   it("should use delays", () => {
      assert.throws(() => start(100, 0, () => true, () => true ));
   });

   it("should not allow starting already running", () => {
      start(100, 100, () => true, () => true)
      assert.throws(() => start(100, 10, () => true, () => true ));
   });

   it("should report progress", (done) => {
      const progressFnStub = sandbox.stub().returns(true)
      start(40, 10, progressFnStub, () => true)
      setTimeout(() => {
         sandbox.assert.calledTwice(progressFnStub)
         done()
      }, 100)
   });

   it("should report completion", (done) => {
      const completionFnStub = sandbox.stub().returns(true)
      start(40, 10, () => true, completionFnStub)
      setTimeout(() => {
         sandbox.assert.calledTwice(completionFnStub)
         done()
      }, 100)
   });

});