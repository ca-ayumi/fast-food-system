import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateClientDto } from '../../application/dto/create-client.dto';
import { ClientService } from '../../domain/service/client.service';

@ApiTags('Clients')
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new client' })
  async createClient(@Body() createClientDto: CreateClientDto) {
    return await this.clientService.createClient(createClientDto);
  }

  @Get(':cpf')
  @ApiOperation({ summary: 'Get all clients' })
  async getClientByCpf(@Param('cpf') cpf: string) {
    return await this.clientService.findClientByCpf(cpf);
  }
}
