import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';
const { expect } = chai;

chai.use(chaiHttp);

describe('GET /', () => {
     it('Should return `Welcome to Authors Haven`', (done) => {
         chai
            .request(app)
            .get('/')
            .end((err, res) => {
              expect(res.status).to.equal(200);
              expect(res).to.be.an('Object');
              expect(res.body).to.have.property('status');
              expect(res.body.message).to.equal(`Welcome to Author's Haven`);
              done()
            });
     });
});  