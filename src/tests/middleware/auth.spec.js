import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import getToken from '../../helpers/jwt.helper';
import {
  isAdmin,
  isSuperAdmin,
  verifyToken
} from '../../middlewares/auth.middleware';
import { Response } from '../utils/db.utils';

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
    const res = new Response();
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(res, 'json').returnsThis();
    const next = () => {};
    await verifyToken(req, res, next);
    expect(res.status).to.have.been.calledWith(401);
    expect(res.json).to.have.been.calledWith({
      status: 401,
      error: 'You do not have access to this resource, unauthorized'
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
    const res = new Response();
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(res, 'json').returnsThis();
    const next = () => {};
    await verifyToken(req, res, next);
    expect(res.status).to.have.been.calledWith(400);
    expect(res.json).to.have.been.calledWith({
      status: 400,
      error: 'You have provide an invalid token'
    });
  });

  it('Should return an error if user is not an admin ', () => {
    const req = {
      user: {
        role: null
      }
    };
    const res = new Response();
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(res, 'json').returnsThis();
    const next = () => {};
    isAdmin(req, res, next);
    expect(res.status).to.have.been.calledWith(403);
    expect(res.json).to.have.been.calledWith({
      message: 'You do not have access to this resource, unauthorized'
    });
  });

  it('Should return an error if user is not super admin ', () => {
    const req = {
      user: {
        role: null
      }
    };
    const res = new Response();
    sinon.stub(res, 'status').returnsThis();
    sinon.stub(res, 'json').returnsThis();
    const next = () => {};
    isSuperAdmin(req, res, next);
    expect(res.status).to.have.been.calledWith(403);
    expect(res.json).to.have.been.calledWith({
      message: 'You do not have access to this resource, unauthorized'
    });
  });
});
