import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {User} from '../models';
import {UserRepository} from '../repositories';

export const UserProfileSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {type: 'string'},
    email: {type: 'string'},
    name: {type: 'string'},
  },
};

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) { }

  @post('/users')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    return this.userRepository.create(user);
  }

  @get('/greet', {
    responses: {
      '200': {
        description: 'Greet the logged in user',
        content: {
          'application/json': {
            // schema: getModelSchemaRef(Credentials),
            schema: UserProfileSchema,
          },
        },
      },
    },
  })
  @authenticate({strategy: 'auth0-jwt', options: {scopes: ['greet']}})
  async greet(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Partial<UserProfile>> {
    currentUserProfile.id = currentUserProfile[securityId];
    const user: Partial<UserProfile> = {...currentUserProfile};
    console.log('-- usuario:  ', currentUserProfile);
    delete user[securityId];
    const mail = user["https://example.com/email"]
    if (mail) {
      console.log('enviando email a ', mail);
      await this.sendmail(mail).catch(console.error)
    }


    // const cadena = user.sub.split("|")[1] || user.sub.split("|")[0];

    return user;
  }

  async sendmail(email: string) {
    const nodemailer = require("nodemailer");

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: true, // true for 465, false for other ports 587
      auth: {
        user: process.env.MAILER_USER, // generated ethereal user
        pass: process.env.MAILER_PASS, // generated ethereal password
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Crypto Markets IAW" <cristian.iaw@yahoo.com>', // sender address
      to: email, // list of receivers
      subject: "Controller test", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }

  @get('/current-user')
  @response(200, {
    description: 'Logued user model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  @authenticate({strategy: 'auth0-jwt', options: {scopes: ['users']}})
  async findCurrentUser(
    // @param.path.string('id') id: string,
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    const user: Partial<UserProfile> = {...currentUserProfile};
    const userid = user.sub.split("|")[1] || user.sub.split("|")[0]
    return this.userRepository.findById(userid, filter);
  }


  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  @authenticate({strategy: 'auth0-jwt', options: {scopes: ['users']}})
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
