document.querySelector('.menu-toggle').addEventListener('click', function() {
            document.querySelector('.menu').classList.toggle('show');
        });

        function abrirModal() {
            document.getElementById('modal').style.display = 'block';
        }

        function fecharModal() {
            document.getElementById('modal').style.display = 'none';
        }