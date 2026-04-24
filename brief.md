Báo cáo doanh thu:

* Có 8 loại hình:
- Du học (DH)
- Khoá học luyện thi(KH)
- Kids(Kids)
- Debate 
- Ngoại khoá (NK)
- Công nghệ ( 'Công nghệ' hoặc 'Kite')
- Trại hè (Camp)
- Commission

- Tab Báo cáo,Nhắc việc chuyển thành: Tab1, Tab2, Tab3.

# Tab1:
* Ở Tab1 chỗ lọc Tất cả đơn vị sửa thành 2 ô datebox lọc (đặt tên là Date_Filter cho các lần nhắc sau) trong khoảng thời gian từ tháng đến tháng.
* Yêu cầu: 8 biểu đồ trên 1 dashboard tùy chọn loại biểu đồ phù hợp với từng loại dữ liệu. Mỗi biểu đồ chia thành các loại hình như đã nêu ở trên gồm 8 loại hình. 
- Tổng doanh thu:
 + Có 8 loại hình
 + Là biểu đồ cột xếp chồng 
 + Có 2 loại trong 1 cột:  'Quà Tặng',  'Doanh thu sau quà tặng'
 + Tổng Dữ liệu theo cột 'Quà Tặng',  'Doanh thu sau quà tặng' theo từng 'Loại hình' trong khoảng thời gian đã lọc
 + Dữ liệu các bản ghi lấy lên báo cáo có các cột 'Tháng ghi nhận doanh thu', 'Năm ghi nhận doanh thu' trong khoảng thời gian Date_Filter đã lọc ở trên.

- Tỷ lệ doanh thu từng loại hình:
 + Có 8 loại hình
 + Mỗi loại hình chiếm bao nhiêu % trong tổng doanh thu
 + % Tổng của cột 'Tháng ghi nhận doanh thu' theo từng 'Loại hình'  trong khoảng thời gian đã lọc
 + Dữ liệu các bản ghi lấy lên báo cáo có các cột 'Tháng ghi nhận doanh thu', 'Năm ghi nhận doanh thu' trong khoảng thời gian Date_Filter đã lọc ở trên.

- Tổng doanh thu từng loại hình dịch vụ:
 + Có 8 loại hình
 + Là biểu đồ cột xếp chồng: có 2 loại  'Đăng ký mới' bên dưới, 'Hoàn thiện' bên trên
 + Lấy các bản ghi có cột ' Phân loại học sinh chuẩn ' là các dữ liệu :  Đăng ký mới, Hoàn thiện
 + Tổng doanh thu cột 'Doanh thu thực tế' gom những dữ liệu cùng ' Phân loại học sinh chuẩn ' và 'Loại hình' trong khoảng thời gian đã lọc 
 + Ghi rõ doanh thu của từng loại vào từng cột luôn, số của từng loại và số tổng.
 + Dữ liệu các bản ghi lấy lên báo cáo có các cột 'Tháng ghi nhận doanh thu', 'Năm ghi nhận doanh thu' trong khoảng thời gian Date_Filter đã lọc ở trên.

- Tổng số lượng đơn hàng từng loại hình dịch vụ:
 + Có 8 loại hình
 + Là biểu đồ cột xếp chồng: có 2 loại  'Đăng ký mới' bên dưới, 'Hoàn thiện' bên trên
 + Lấy các bản ghi có cột ' Phân loại học sinh chuẩn ' là các dữ liệu :  Đăng ký mới, Hoàn thiện
 + Tổng số lượng những bản ghi cùng ' Phân loại học sinh' và 'Loại hình' trong khoảng thời gian đã lọc 
 + Ghi rõ số lượng của từng loại vào từng cột luôn, số của từng loại và số tổng.
 + Dữ liệu các bản ghi lấy lên báo cáo có các cột 'Tháng ghi nhận doanh thu', 'Năm ghi nhận doanh thu' trong khoảng thời gian Date_Filter đã lọc ở trên.

- Tổng doanh thu từng team:
 + có combobox chọn loại: Team, Chi nhánh
 + Nếu chọn loại là Team: Tổng ' Doanh thu sau quà tặng ' theo từng team ở cột 'Team'
 + Nếu chọn loại là Team: Tổng ' Doanh thu sau quà tặng ' theo từng chi nhánh ở cột 'CN'
 + Dữ liệu các bản ghi lấy lên báo cáo có các cột 'Tháng ghi nhận doanh thu', 'Năm ghi nhận doanh thu' trong khoảng thời gian Date_Filter đã lọc ở trên.

- Xếp hạng doanh số từng sale 
 + Tổng doanh thu ở cột ' Doanh thu sau quà tặng ' của từng sale 'SALE' từ cao xuống thấp dạng bảng. 
 + Trong bảng có các cột STT, Mã NV, Tên sale, Tổng doanh thu, Du học (Tổng doanh thu ở cột 'Doanh thu sau quà tặng' có 'Loại hình' là DH), Đào tạo (Tổng doanh thu ở cột 'Doanh thu sau quà tặng' có 'Loại hình' là KH, Kids hoặc Debate), Ngoại khóa (Tổng doanh thu ở cột 'Doanh thu sau quà tặng' có 'Loại hình' là NK, Công nghệ hoặc Kite), Khác (là các 'Loại hình' còn lại)
 + Dữ liệu các bản ghi lấy lên báo cáo có các cột 'Tháng ghi nhận doanh thu', 'Năm ghi nhận doanh thu' trong khoảng thời gian Date_Filter đã lọc ở trên.

- Doanh thu theo từng nguồn data, ví dụ: doanh thu đến từ nguồn FB hay từ nguồn học sinh du học (HSĐH)...
 + Biểu đồ tròn
 + Tổng cột ' Doanh thu thực tế ' theo từng 'Phân loại nguồn data'
 + Dữ liệu các bản ghi lấy lên báo cáo có các cột 'Tháng ghi nhận doanh thu', 'Năm ghi nhận doanh thu' trong khoảng thời gian Date_Filter đã lọc ở trên.

# Tab2:
* Ở Tab1 chỗ lọc Tất cả đơn vị sửa thành 2 ô datebox lọc (đặt tên là Date_Filter cho các lần nhắc sau) trong khoảng thời gian từ tháng đến tháng.
* Yêu cầu: 8 biểu đồ trên 1 dashboard tùy chọn loại biểu đồ phù hợp với từng loại dữ liệu. Mỗi biểu đồ chia thành các loại hình như đã nêu ở trên gồm 8 loại hình. 
- Tổng doanh thu:
 + Có 8 loại hình
 + Là biểu đồ cột xếp chồng 
 + Có 2 loại trong 1 cột:  'Quà Tặng',  'Doanh thu sau quà tặng'
 + Tổng Dữ liệu theo cột 'Quà Tặng',  'Doanh thu sau quà tặng' theo từng 'Loại hình' trong khoảng thời gian đã lọc
 + Dữ liệu các bản ghi lấy lên báo cáo có các cột 'Tháng ghi nhận doanh thu', 'Năm ghi nhận doanh thu' trong khoảng thời gian Date_Filter đã lọc ở trên.

- Tỷ lệ doanh thu từng loại hình:
 + Có 8 loại hình
 + Mỗi loại hình chiếm bao nhiêu % trong tổng doanh thu
 + % Tổng của cột 'Tháng ghi nhận doanh thu' theo từng 'Loại hình'  trong khoảng thời gian đã lọc
 + Dữ liệu các bản ghi lấy lên báo cáo có các cột 'Tháng ghi nhận doanh thu', 'Năm ghi nhận doanh thu' trong khoảng thời gian Date_Filter đã lọc ở trên.

- Biến động doanh thu từng loại hình dịch vụ:
 + Có 8 loại hình
 + Là biểu đồ cột xếp chồng: có 2 loại  'Đăng ký mới' bên dưới, 'Hoàn thiện' bên trên
 + Lấy các bản ghi có cột ' Phân loại học sinh chuẩn ' là các dữ liệu :  Đăng ký mới, Hoàn thiện
 + Tổng doanh thu cột 'Doanh thu thực tế' gom những dữ liệu cùng ' Phân loại học sinh chuẩn ' và 'Loại hình' trong khoảng thời gian đã lọc 
 + Ghi rõ doanh thu của từng loại vào từng cột luôn, số của từng loại và số tổng.
 + Dữ liệu các bản ghi lấy lên báo cáo có các cột 'Tháng ghi nhận doanh thu', 'Năm ghi nhận doanh thu' trong khoảng thời gian Date_Filter đã lọc ở trên.

- Biến động số lượng đơn hàng từng loại hình dịch vụ:
 + Có 8 loại hình
 + Là biểu đồ cột xếp chồng: có 2 loại  'Đăng ký mới' bên dưới, 'Hoàn thiện' bên trên
 + Lấy các bản ghi có cột ' Phân loại học sinh chuẩn ' là các dữ liệu :  Đăng ký mới, Hoàn thiện
 + Tổng số lượng những bản ghi cùng ' Phân loại học sinh' và 'Loại hình' trong khoảng thời gian đã lọc 
 + Ghi rõ số lượng của từng loại vào từng cột luôn, số của từng loại và số tổng.
 + Dữ liệu các bản ghi lấy lên báo cáo có các cột 'Tháng ghi nhận doanh thu', 'Năm ghi nhận doanh thu' trong khoảng thời gian Date_Filter đã lọc ở trên.

- Biến động doanh thu từng team:
 + có combobox chọn loại: Team, Chi nhánh
 + Nếu chọn loại là Team: Tổng ' Doanh thu sau quà tặng ' theo từng team ở cột 'Team'
 + Nếu chọn loại là Team: Tổng ' Doanh thu sau quà tặng ' theo từng chi nhánh ở cột 'CN'
 + Dữ liệu các bản ghi lấy lên báo cáo có các cột 'Tháng ghi nhận doanh thu', 'Năm ghi nhận doanh thu' trong khoảng thời gian Date_Filter đã lọc ở trên.


- Phân tích tỷ lệ doanh thu & số lượng đơn hàng của từng sale 
- Xếp hạng doanh số từng sale 
- Biến động số lượng sale đang làm việc/onboard/nghỉ việc
- Doanh thu theo từng nguồn data, ví dụ: doanh thu đến từ nguồn FB hay từ nguồn học sinh du học (HSĐH)...