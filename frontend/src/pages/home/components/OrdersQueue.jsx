import React from 'react';

export default function OrdersQueue({ pedidos }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 h-full">
      <h3 className="text-lg font-bold text-[#2A3240] mb-4 border-b pb-2">
        Fila de Produção
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-sm text-gray-500 border-b border-gray-200">
              <th className="pb-3 font-semibold">Pedido</th>
              <th className="pb-3 font-semibold">Cliente / Item</th>
              <th className="pb-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {pedidos.length > 0 ? (
              pedidos.map((pedido) => (
                <tr key={pedido.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 font-bold text-[#2A3240]">{pedido.id}</td>
                  <td className="py-3">
                    <div className="font-semibold text-[#2A3240]">{pedido.cliente}</div>
                    <div className="text-gray-500 text-xs">{pedido.item}</div>
                  </td>
                  <td className="py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                      {pedido.status} {pedido.progresso !== '-' && `(${pedido.progresso})`}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-10 text-center text-gray-400 italic">
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
