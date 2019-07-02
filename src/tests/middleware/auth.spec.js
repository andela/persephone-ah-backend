import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import getToken from '../../helpers/jwt.helper';
import middleware from '../../middlewares/auth.middleware';
import { Response } from '../utils/db.utils';

dotenv.config();

const { expect } = chai;

chai.use(chaiHttp);
chai.use(sinonChai);

describe('Authentication middleware', () => {
  it('Should return an error if token is not provided', async () => {
    const req = {
      headers: {
        authorization: ''
      }
    };
    const response = new Response();
    sinon.stub(response, 'status').returnsThis();
    sinon.stub(response, 'json').returnsThis();
    const next = () => {};
    await middleware.verifyToken(req, response, next);
    expect(response.status).to.have.been.calledWith(400);
    expect(response.json).to.have.been.calledWith({
      status: 400,
      error: 'No token provided, you do not have access to this page'
    });
  });

  it('Should return an error if there is a deep error ', async () => {
    const token = getToken({
      id: 23,
      role: 'sample'
    });

    const req = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };
    const response = new Response();
    sinon.stub(response, 'status').returnsThis();
    sinon.stub(response, 'json').returnsThis();
    const next = () => {};
    await middleware.verifyToken(req, response, next);
    expect(response.status).to.have.been.calledWith(400);
    expect(response.json).to.have.been.calledWith({
      status: 400,
      error: 'You have provide an invalid token'
    });
  });

  it('Should return an error if there is an invalid token', async () => {
    const req = {
      headers: {
        authorization: `Bearer uieruierueior.ererer.ererer.erre`
      }
    };
    const response = new Response();
    sinon.stub(response, 'status').returnsThis();
    sinon.stub(response, 'json').returnsThis();
    const next = () => {};
    await middleware.verifyToken(req, response, next);
    expect(response.status).to.have.been.calledWith(400);
    expect(response.json).to.have.been.calledWith({
      status: 400,
      error: 'jwt malformed'
    });
  });
});
