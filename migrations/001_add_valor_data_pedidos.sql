USE loja;

ALTER TABLE pedidos
    ADD COLUMN data DATE NULL AFTER total;

UPDATE pedidos
SET data = criado_em
WHERE data IS NULL;

ALTER TABLE pedidos
    MODIFY COLUMN data DATE NOT NULL;

ALTER TABLE itens_pedido
    ADD COLUMN valor DECIMAL(10, 2) NOT NULL DEFAULT 0.00 AFTER preco_unitario,
    ADD COLUMN data DATE NULL AFTER valor;

UPDATE itens_pedido ip
JOIN pedidos p ON p.id = ip.pedido_id
SET ip.valor = ip.quantidade * ip.preco_unitario,
    ip.data = p.data
WHERE ip.valor = 0.00 OR ip.data IS NULL;

ALTER TABLE itens_pedido
    MODIFY COLUMN valor DECIMAL(10, 2) NOT NULL,
    MODIFY COLUMN data DATE NOT NULL;
