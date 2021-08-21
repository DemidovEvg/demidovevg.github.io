# ***demidovevg.github.io*** or ***autoscb.ru***
## Пограмма для расчета участков извещения для работы переезда, пешеходного перехода, оповещения монтеров пути, а также помогает для расчета САУТ.
Разметка создавалась с помощью grid. <br>
Расчет релазиован посредством *javasctript*.<br>
За основу взят расчет для переезда.<br>
Алгоритм подсчета:
1) Пытаемся восстановить табличные данные из localStorage.
2) Анализируем данные на пустоту и корректность.
3) Рассчитываем параметры (время проследования по участку, скорость в конце, только разгон, только ускорение, разгон и ускорение и т.д.) на каждом участке.
4) Если начальная скорость равна 0, то значит рассчитываем режим троганья с места от светофора.
5) Если начальная скорость больше 0, то рассчитваем режим следования поезда.
6) Интегрируя все участке проверяем, итоговое время проследования с заданным, если итоговое время больше заданного, то выдаем результат что извещения хватает.
7) Для расчета участка извещения рассчетного, необходимо набирать время проследования начиная от объекта расчета, когда времени достаточно, это говорит о том 
что точка подачи должна быть на этом участке, после чего участок анализиуется, и если требуется разбивается на подучастки(1-с ускорением, 2-с постоянной скоростью).
После чего находим расчетный участок извещения.
8) Для удобства рассчета, на каждое поле ввода повешен слушатель событий, и если значение меняется, то мы пытаемся пересчитать извещение. 
Это сделано для того что бы не нажимать кнопку рассчета каждый раз после изменения значений.
9) Для удоства ввода значений реализован слушатель нажатий кнопок стрелок и enter. Стрелками можно переходим по полям в любых направлениях. 
Enter позволяет переходить по полям слева-направо, сверху-вниз. С нижнего правого поля перескакиваем на верхнее левое. 
При переходах выделяется все значение в поле. Это сделано для того что бы не надо было удалять предыдущии данные, а можно было просто вбить новые.

