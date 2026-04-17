import React from 'react';

export default function OrdersQueue({ pedidos }) {
  return (
    <div className="bg-white dark:bg-[#1a1f2e] rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-800 h-full transition-colors duration-300">
      <h3 className="text-lg font-bold text-[#2A3240] dark:text-white mb-4 border-b dark:border-gray-800 pb-2">
        Fila de Produção
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
              <th className="pb-3 font-semibold uppercase text-[10px] tracking-wider">Pedido</th>
              <th className="pb-3 font-semibold uppercase text-[10px] tracking-wider">Cliente / Item</th>
              <th className="pb-3 font-semibold uppercase text-[10px] tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {pedidos.length > 0 ? (
              pedidos.map((pedido) => (
                <tr key={pedido.id} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 font-bold text-[#2A3240] dark:text-gray-200">{pedido.id}</td>
                  <td className="py-3">
                    <div className="font-semibold text-[#2A3240] dark:text-gray-200">{pedido.cliente}</div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs">{pedido.item}</div>
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 uppercase tracking-tighter">
                      {pedido.status} {pedido.progresso !== '-' && `(${pedido.progresso})`}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-10 text-center text-gray-400 dark:text-gray-500 italic">
                  Nenhum pedido em produção no momento.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
