**Projeyi çalıştırmak için kurulması gerekenler**
Ubuntu 16.04 ve nodejs 6.9.2 ile test edilmiştir.

**python 2.7.12**

 - sudo apt-get install build-essential checkinstall
 - sudo apt-get install libreadline-gplv2-dev libncursesw5-dev
   libssl-dev libsqlite3-dev tk-dev libgdbm-dev libc6-dev
 - cd /usr/src
 - wget https://www.python.org/ftp/python/2.7.12/Python-2.7.12.tgz
 - tar xzf Python-2.7.12.tgz
 - cd Python-2.7.12
 - sudo ./configure
 - sudo make altinstall

**node.js**

 - curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
 - sudo apt-get install -y nodejs

**npm**

 - sudo apt-get install npm

**Proje için eklenmesi gereken kütüphaneler**

 - npm install express
 - npm install socket.io
 - npm install mysql

Ayrıca projenin mesaj göndermek için kullanılan kullanıcı arayüzünü çalıştırmak için apache server kurulmalı ve index.php dosyası burada /var/www/html/ içerisine kaydedilmeli ve nodejs.sql dosyası database'e import edilmelidir.