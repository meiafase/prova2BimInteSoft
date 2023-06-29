using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using MySql.Data.MySqlClient;
using System.Data;

ConnectionFactory factory = new ConnectionFactory
{
    HostName = "localhost"
};

using (var connection = factory.CreateConnection())
{
    using (var channel = connection.CreateModel())
    {
        GetFolha(channel, "FILA", ConsoleColor.Blue);
        Console.ReadLine();
    }
}

void GetFolha(IModel channel, string fila, ConsoleColor cor)
{
    var consumer = new EventingBasicConsumer(channel);
    consumer.Received += (model, message) =>
    {
        var body = message.Body.ToArray();
        var mensagem = Encoding.UTF8.GetString(body);
        Console.ForegroundColor = cor;
        Console.WriteLine("Get Folha ->> " + mensagem);
    };
    channel.BasicConsume(
        queue: fila,
        autoAck: true,
        consumer: consumer
    );
}