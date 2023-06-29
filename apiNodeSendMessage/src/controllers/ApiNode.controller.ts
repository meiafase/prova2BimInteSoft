import { Request, Response } from "express"
import { ApiNode } from "../models/ApiNode.models";
import { ApiNodeRepository } from "../data/ApiNode.repository";
import { RabbitMQService } from "../services/RabbitMQ.services";

const repository = new ApiNodeRepository();
const service = new RabbitMQService();
export class ApiNodeController {
    async cadastrarApiNode(request: Request, response: Response) {

        let apiNode = request.body;

        let salarioBruto = apiNode.horas * apiNode.valor;
        let fgtsPorcentagem = salarioBruto * 0.08;
        let fgts = salarioBruto - fgtsPorcentagem;
        let irrf = 0;
        let inss = 0;
        if (salarioBruto > 1903.98 && salarioBruto < 2826.65) {
            irrf = (salarioBruto * 0.075) - 142.80;
        } else if (salarioBruto > 2826.66 && salarioBruto < 3751.05) {
            irrf = (salarioBruto * 0.15) - 354.80;
        } else if (salarioBruto > 3751.06 && salarioBruto < 4664.68) {
            irrf = (salarioBruto * 0.225) - 636.13;
        } else if (salarioBruto > 4664.68) {
            irrf = (salarioBruto * 0.275) - 869.36;
        }

        if (salarioBruto < 1693.72) {
            inss = salarioBruto * 0.08
        } else if (salarioBruto > 1693.73 && salarioBruto > 2822.90) {
            inss = salarioBruto * 0.09
        } else if (salarioBruto > 2822.91 || salarioBruto > 5645.80) {
            inss = salarioBruto * 0.11
        } else {
            inss = 621.03
        }

        let salarioLiquido = salarioBruto - irrf - inss;

        apiNode ={
            "mes": apiNode.mes,
            "ano": apiNode.ano,
            "horas": apiNode.horas,
            "valor": apiNode.valor,
            "bruto": salarioBruto, 
            fgts,
            "irrf": Number(irrf.toFixed(2)),
            inss,
            salarioLiquido,
            "funcionario": apiNode.funcionario
        }

        console.log(apiNode);

        apiNode = await repository.cadastrarApiNode(apiNode);
        service.sendMessage(JSON.stringify(apiNode));
        console.log('mensagem foi Enviada pra a FILA')

        return({ status: 'OK', content: 'Sucesso!' }
        )
    }
}