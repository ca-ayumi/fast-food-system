import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ClientDto } from '../../dto/client.dto';
import { ClientService } from '../../../domain/service/client.service';

@ApiTags('Clients')
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  //   @Post()
  //   @ApiOperation({ summary: 'Create a new client' })
  //   async createClient(@Body() createClientDto: CreateClientDto) {
  //     return await this.clientService.createClient(createClientDto);
  //   }
  //
  //   @Get('cpf/:cpf')
  //   @ApiOperation({ summary: 'Get clients by cpf' })
  //   async getClientByCpf(@Param('cpf') cpf: string) {
  //     return await this.clientService.findClientByCpf(cpf);
  //   }
  // }

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiResponse({
    status: 201,
    description: 'The client has been successfully created.',
    type: ClientDto,
  })
  async createClient(@Body() createClientDto: ClientDto): Promise<ClientDto> {
    try {
      return await this.clientService.createClient(createClientDto);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('cpf/:cpf')
  @ApiOperation({ summary: 'Get client by CPF' })
  @ApiResponse({
    status: 200,
    description: 'Client found',
    type: ClientDto,
  })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiParam({ name: 'cpf', description: 'CPF of the client' })
  async getClientByCpf(@Param('cpf') cpf: string): Promise<ClientDto> {
    try {
      return await this.clientService.findClientByCpf(cpf);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: error.message },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
