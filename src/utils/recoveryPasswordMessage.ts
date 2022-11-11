import { Users } from "src/users/entities/users.entities";

const recoveryPasswordMessage = (
	user: Users,
	token: string,
): { messageHtml: string; messageText: string } => {
	const messageHtml = `
	<h4>Olá ${user.name},</h4>
	<p>Você solicitou o e-mail de recuperação de senha. Clique <a
			href="https://gamedevs.vercel.app/recover/${user.id}/${token}">aqui</a> e siga as instruções para acessar o
		sistema.</p>
	`;

	const messageText = `Olá ${user.name}, \nVocê solicitou o e-mail de recuperação de senha. Clique no link abaixo e siga as instruções para acessar o sistema. \nhttps://gamedevs.vercel.app/recover/${user.id}/${token}.`;

	return { messageHtml, messageText };
};

export default recoveryPasswordMessage;
