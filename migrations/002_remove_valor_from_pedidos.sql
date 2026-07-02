USE loja;

SET @drop_valor_pedidos = (
    SELECT IF(
        EXISTS(
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = DATABASE()
              AND table_name = 'pedidos'
              AND column_name = 'valor'
        ),
        'ALTER TABLE pedidos DROP COLUMN valor',
        'SELECT "Coluna valor nao existe em pedidos"'
    )
);

PREPARE stmt FROM @drop_valor_pedidos;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
