import chai, { assert } from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";

import server from "../server";
import * as scraping from "../services/scraping"

const sandbox = sinon.createSandbox();

chai.use(chaiHttp);

import { isScraping, start, stop } from "../services";
 
describe("Estates", () => {

   afterEach(() => {
      stop()
      sandbox.restore()
   });

   it('should return estates', () => {
      chai.request(server)
         .get('/api/estates')
         .then(res => assert.equal(res.status, 200))
   });

   it('should start scraping with defaults', () => {
      const startStub = sandbox.stub(scraping, 'start')
      chai.request(server)
         .post('/api/scraping')
         .then(res => {
            assert.equal(res.status, 201)
            sandbox.assert.called(startStub)
            assert.equal(startStub.getCall(0).args[0], 500)
            assert.equal(startStub.getCall(0).args[1], 500)
         })
   })

   it('should start scraping with count param', () => {
      const startStub = sandbox.stub(scraping, 'start')
      chai.request(server)
         .post('/api/scraping?c=100')
         .then(res => {
            assert.equal(res.status, 201)
            sandbox.assert.called(startStub)
            assert.equal(startStub.getCall(0).args[0], 100)
            assert.equal(startStub.getCall(0).args[1], 500)
         })
   })

   it('should start scraping with delay param', () => {
      const startStub = sandbox.stub(scraping, 'start')
      chai.request(server)
         .post('/api/scraping?d=100')
         .then(res => {
            assert.equal(res.status, 201)
            sandbox.assert.called(startStub)
            assert.equal(startStub.getCall(0).args[0], 500)
            assert.equal(startStub.getCall(0).args[1], 100)
         })
   })

   it('should not stop scraping when not running', () => {
      const stopStub = sandbox.stub(scraping, 'stop')
      chai.request(server)
         .delete('/api/scraping')
         .then(res => {
            assert.equal(res.status, 400)
            sandbox.assert.called(stopStub)
         })
   })

});